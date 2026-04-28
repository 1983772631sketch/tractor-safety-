// =====================================================
// TRACTOR SAFETY SYSTEM — EMI-HARDENED + WiFi + Serial
// ESP32 | 2x HC-SR04 | ZMPT101B | NEO-6M GPS | Buzzer
// Sends data to Dashboard via HTTP POST and USB Serial
// =====================================================

#include <WiFi.h>
#include <HTTPClient.h>
#include <TinyGPS++.h>

// ── WiFi Configuration ──────────────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_SSID";       // ← Replace with your WiFi name
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";    // ← Replace with your WiFi password

// ── Backend Configuration ───────────────────────────
const char* SERVER_URL = "http://YOUR_SERVER_IP:3001/api/telemetry";  // ← Replace YOUR_SERVER_IP with your PC's local IP (e.g. 192.168.1.100)
const char* API_KEY    = "tractor_secret_123";                         // Must match server/.env API_KEY

// ── Pin Definitions ──────────────────────────────────
#define ZMPT_PIN          34    // ADC1 only — do NOT use ADC2 pins with WiFi
#define BUZZER_PIN        25

#define TRIG1             5     // Ultrasonic 1 — Loader height
#define ECHO1             18

#define TRIG2             14    // Ultrasonic 2 — Forward obstacle
#define ECHO2             27

#define GPS_RX            16    // UART2 RX
#define GPS_TX            17    // UART2 TX

#define LED_PIN           2     // Built-in LED for WiFi status

// ── Thresholds ───────────────────────────────────────
#define LOADER_WARN_CM      150   // Warn if loader below 150cm
#define OBSTACLE_WARN_CM    120   // Warn if obstacle within 120cm
#define ZMPT_THRESHOLD      3500  // Tune this for your environment
#define MAX_DISTANCE_CM     400
#define EMI_CONFIRM_COUNT   5     // Consecutive hits needed to trigger alert
#define ULTRASONIC_AGREE_CM 10    // Max cm difference between two readings

// ── WiFi Retry Config ────────────────────────────────
#define WIFI_CONNECT_TIMEOUT_MS  15000
#define WIFI_RETRY_INTERVAL_MS   30000
#define HTTP_TIMEOUT_MS          5000

TinyGPSPlus gps;

// ── Telemetry Data (shared between sensors & output) ─
float telemetry_loader    = 0;
float telemetry_obstacle  = 0;
float telemetry_zmpt      = 0;
String telemetry_lat      = "--.------";
String telemetry_lng      = "--.------";
bool   telemetry_fix      = false;
int    telemetry_sats     = 0;

// ── State ─────────────────────────────────────────────
int zmptTriggerCount   = 0;
int loader_trigCount   = 0;
int obstacle_trigCount = 0;
bool wifiConnected     = false;
unsigned long lastWifiAttempt = 0;

// =====================================================
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial2.begin(9600, SERIAL_8N1, GPS_RX, GPS_TX);

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  pinMode(TRIG1, OUTPUT);
  pinMode(TRIG2, OUTPUT);
  pinMode(ECHO1, INPUT);
  pinMode(ECHO2, INPUT);

  // Boot beep — confirms system is alive
  for (int i = 0; i < 2; i++) {
    digitalWrite(BUZZER_PIN, HIGH); delay(100);
    digitalWrite(BUZZER_PIN, LOW);  delay(100);
  }

  Serial.println("\n=== TRACTOR SAFETY SYSTEM STARTED ===");
  Serial.println("EMI-Hardened | WiFi+Serial | 2x US | ZMPT | GPS");
  Serial.println("=================================================\n");

  // Connect to WiFi
  connectWiFi();
}

// =====================================================
void loop() {
  // 1. Read all sensors (updates telemetry_* globals)
  readUltrasonic1();
  readUltrasonic2();
  readPowerLine();
  readGPS();

  // 2. Send telemetry over Serial (pipe-delimited for Web Serial API)
  sendSerialTelemetry();

  // 3. Send telemetry over WiFi (HTTP POST to backend)
  if (wifiConnected) {
    sendWiFiTelemetry();
  } else {
    // Attempt WiFi reconnect periodically
    if (millis() - lastWifiAttempt > WIFI_RETRY_INTERVAL_MS) {
      connectWiFi();
    }
  }

  Serial.println("------------------------------------------");
  delay(500);
}

// ── WiFi Connection ───────────────────────────────────
void connectWiFi() {
  lastWifiAttempt = millis();
  Serial.print("WiFi: Connecting to ");
  Serial.print(WIFI_SSID);
  Serial.print("...");

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long startAttempt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < WIFI_CONNECT_TIMEOUT_MS) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    digitalWrite(LED_PIN, HIGH);
    Serial.println(" CONNECTED!");
    Serial.print("WiFi: IP Address = ");
    Serial.println(WiFi.localIP());

    // Success beep pattern (3 quick high beeps)
    for (int i = 0; i < 3; i++) {
      digitalWrite(BUZZER_PIN, HIGH); delay(50);
      digitalWrite(BUZZER_PIN, LOW);  delay(50);
    }
  } else {
    wifiConnected = false;
    digitalWrite(LED_PIN, LOW);
    Serial.println(" FAILED (will retry)");
  }
}

// ── Serial Telemetry Output ──────────────────────────
// Format: LO:<loader>|OB:<obstacle>|ZM:<zmpt>|LT:<lat>|LN:<lng>|FX:<0|1>|ST:<sats>
// This is what the dashboard's Web Serial parser expects.
void sendSerialTelemetry() {
  String line = "LO:" + String(telemetry_loader, 1)
              + "|OB:" + String(telemetry_obstacle, 1)
              + "|ZM:" + String(telemetry_zmpt, 1)
              + "|LT:" + telemetry_lat
              + "|LN:" + telemetry_lng
              + "|FX:" + String(telemetry_fix ? 1 : 0)
              + "|ST:" + String(telemetry_sats);
  Serial.println(line);
}

// ── WiFi Telemetry Output ────────────────────────────
// POSTs JSON to the backend server
void sendWiFiTelemetry() {
  // Check WiFi is still connected
  if (WiFi.status() != WL_CONNECTED) {
    wifiConnected = false;
    digitalWrite(LED_PIN, LOW);
    Serial.println("WiFi: Connection lost");
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", API_KEY);
  http.setTimeout(HTTP_TIMEOUT_MS);

  // Build JSON payload
  String json = "{";
  json += "\"loader\":" + String(telemetry_loader, 1) + ",";
  json += "\"obstacle\":" + String(telemetry_obstacle, 1) + ",";
  json += "\"zmpt\":" + String(telemetry_zmpt, 1) + ",";
  json += "\"lat\":\"" + telemetry_lat + "\",";
  json += "\"lng\":\"" + telemetry_lng + "\",";
  json += "\"fix\":" + String(telemetry_fix ? "true" : "false") + ",";
  json += "\"sats\":" + String(telemetry_sats);
  json += "}";

  int httpCode = http.POST(json);

  if (httpCode == 201) {
    Serial.println("WiFi: Data sent OK");
    // Brief LED blink to indicate successful send
    digitalWrite(LED_PIN, LOW);  delay(30);
    digitalWrite(LED_PIN, HIGH);
  } else {
    Serial.print("WiFi: POST failed, code=");
    Serial.println(httpCode);
  }

  http.end();
}

// ── Ultrasonic 1 : Loader Height ──────────────────────
void readUltrasonic1() {
  int dist = getDistanceFiltered(TRIG1, ECHO1);

  if (dist == -1) {
    Serial.println("Loader Sensor: No echo / noisy — skipped");
    loader_trigCount = 0;
    return;
  }

  telemetry_loader = dist;  // Store for telemetry

  Serial.print("Loader Height: ");
  Serial.print(dist);
  Serial.println(" cm");

  if (dist < LOADER_WARN_CM) {
    loader_trigCount++;
    if (loader_trigCount >= 3) {
      Serial.println("  >> WARNING: Loader too high!");
      triggerBuzzer(3);
      loader_trigCount = 0;
    }
  } else {
    loader_trigCount = 0;
  }
}

// ── Ultrasonic 2 : Forward Obstacle ───────────────────
void readUltrasonic2() {
  int dist = getDistanceFiltered(TRIG2, ECHO2);

  if (dist == -1) {
    Serial.println("Obstacle Sensor: No echo / noisy — skipped");
    obstacle_trigCount = 0;
    return;
  }

  telemetry_obstacle = dist;  // Store for telemetry

  Serial.print("Forward Obstacle: ");
  Serial.print(dist);
  Serial.println(" cm");

  if (dist < OBSTACLE_WARN_CM) {
    obstacle_trigCount++;
    if (obstacle_trigCount >= 3) {
      Serial.println("  >> WARNING: Obstacle too close!");
      triggerBuzzer(2);
      obstacle_trigCount = 0;
    }
  } else {
    obstacle_trigCount = 0;
  }
}

// ── EMI-Hardened Distance: 2 readings must agree ──────
int getDistanceFiltered(int trig, int echo) {
  int d1 = getRawDistance(trig, echo);
  delay(10);
  int d2 = getRawDistance(trig, echo);

  if (d1 == 0 || d2 == 0) return -1;             // Timeout
  if (d1 >= MAX_DISTANCE_CM) return -1;           // Out of range
  if (abs(d1 - d2) > ULTRASONIC_AGREE_CM) return -1; // EMI spike — discard

  return (d1 + d2) / 2;
}

int getRawDistance(int trig, int echo) {
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  long duration = pulseIn(echo, HIGH, 30000);
  if (duration == 0) return 0;
  return (int)(duration * 0.034 / 2);
}

// ── ZMPT101B : Power Line Detection ───────────────────
void readPowerLine() {
  int value = readZMPT_filtered();

  telemetry_zmpt = value;  // Store for telemetry

  Serial.print("ZMPT ADC (filtered): ");
  Serial.println(value);

  if (value > ZMPT_THRESHOLD) {
    zmptTriggerCount++;
    Serial.print("  Trigger count: ");
    Serial.println(zmptTriggerCount);

    if (zmptTriggerCount >= EMI_CONFIRM_COUNT) {
      Serial.println("  !! POWER LINE DETECTED — DANGER !!");
      triggerBuzzer(6);
      zmptTriggerCount = 0;
    }
  } else {
    zmptTriggerCount = 0;
  }
}

// Sorted median filter — removes EMI spikes
int readZMPT_filtered() {
  const int SAMPLES = 20;
  int readings[SAMPLES];

  for (int i = 0; i < SAMPLES; i++) {
    readings[i] = analogRead(ZMPT_PIN);
    delayMicroseconds(500);
  }

  // Bubble sort
  for (int i = 0; i < SAMPLES - 1; i++)
    for (int j = i + 1; j < SAMPLES; j++)
      if (readings[i] > readings[j]) {
        int t = readings[i];
        readings[i] = readings[j];
        readings[j] = t;
      }

  // Average middle 12, discard top 4 and bottom 4
  long sum = 0;
  for (int i = 4; i < 16; i++) sum += readings[i];
  return (int)(sum / 12);
}

// ── GPS ───────────────────────────────────────────────
void readGPS() {
  while (Serial2.available() > 0) {
    gps.encode(Serial2.read());
  }

  if (gps.location.isValid()) {
    telemetry_lat = String(gps.location.lat(), 6);
    telemetry_lng = String(gps.location.lng(), 6);
    telemetry_fix = true;
    telemetry_sats = gps.satellites.value();

    Serial.print("GPS: Lat=");
    Serial.print(telemetry_lat);
    Serial.print("  Lng=");
    Serial.println(telemetry_lng);
    Serial.print("     Satellites: ");
    Serial.println(telemetry_sats);
  } else {
    telemetry_fix = false;
    telemetry_sats = 0;
    Serial.println("GPS: Waiting for fix...");
  }
}

// ── Buzzer ────────────────────────────────────────────
void triggerBuzzer(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(80);
    digitalWrite(BUZZER_PIN, LOW);
    delay(80);
  }
}
