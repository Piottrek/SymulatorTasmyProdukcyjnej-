# Symulator Taśmy Produkcyjnej  
### Projekc demonstracyjny wzorców projektowych: **Strategy · Observer · Facade · Memento**

---

## Opis projektu

Aplikacja przedstawia uproszczony system zarządzania zadaniami na taśmie produkcyjnej.  
Front komunikuje się z backendem poprzez REST API, a aktualizacje pojawiają się w czasie rzeczywistym dzięki WebSocketom.

Projekt został stworzony, aby pokazać praktyczne wykorzystanie wzorców projektowych. Wzorce ktore zostłay użyte:

- **Strategy** — dynamiczna zmiana sposobu sortowania zadań (FIFO / Priorytet)
- **Observer** — podłączenie powiadomień WebSocket po zmianie statusu zadania
- **Facade** — uproszczony interfejs dla logiki biznesowej (REST API)
- **Memento** — możliwość cofnięcia ostatniej operacji (UNDO)

Frontend jest w pełni dynamiczny i reaguje na zmiany backendu w czasie rzeczywistym.

---

##  Funkcjonalności

### ✔Zarządzanie zadaniami
- Dodawanie nowych zadań  
- Zadania mogą być oznaczone jako **priorytetowe**  
- Zmiana statusu: `Nowe → W toku → Zakończone`  

###  Strategie sortowania
- **FIFO** — kolejność dodania zadania  
- **PRIORYTET** — zadania oznaczone 🔥 pojawiają się wyżej  

###  Powiadomienia na żywo
- WebSocket wysyła aktualizacje do przeglądarki po każdej zmianie statusu  
- Interfejs odświeża się automatycznie bez reloadu

###  Cofanie zmian
- Każda operacja zapamiętuje stan systemu  
- Przycisk **Undo** przywraca wcześniejszy stan

###  Fasada 
- `MenedzerProdukcjiFasada` ukrywa szczegóły działania systemu  
- REST API jest uproszczone i spójne  


---

## 📂 Technologie

### 🔧 Backend
- Java 17  
- Spring Boot  
- Spring Web  
- Spring WebSocket / STOMP  
- JPA + H2 / MySQL  
- Lombok (opcjonalnie)

### 🎨 Frontend
- HTML + CSS  
- Vanilla JavaScript  
- WebSocket (SockJS + STOMP)

---

## 🚀 Uruchamianie

### Backend

mvn spring-boot:run
lub w IDE (IntelliJ / Eclipse)

Aplikacja domyślnie uruchamia się pod:

http://localhost:8080

---

## 🔌 REST API

### Dodanie zadania

POST /api/zadania?nazwa=Nazwa&priorytet=true


### Zmiana strategii

POST /api/strategia?strategia=FIFO
POST /api/strategia?strategia=PRIORYTET
