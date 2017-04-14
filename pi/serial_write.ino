int sensorPin = A0;
int sensorVal = 0;
int lastVal = 0;
long timer = 0;
long TIMEOUT = 43200;
void setup() {
  Serial.begin(19200);
}

void loop() {
  sensorVal = analogRead(sensorPin);
  if (sensorVal - lastVal != 0 || timer > TIMEOUT) {
    Serial.println(sensorVal);
    timer = 0;
  }
  lastVal = sensorVal;
  timer = timer + 1;
}