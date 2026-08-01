package com.travelplanner.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    public static class PaymentRequest {
        private String cardHolder;
        private String cardNumber;
        private String expiry;
        private String cvv;
        private double amount;
        private String packageName;

        public String getCardHolder() { return cardHolder; }
        public void setCardHolder(String cardHolder) { this.cardHolder = cardHolder; }
        public String getCardNumber() { return cardNumber; }
        public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
        public String getExpiry() { return expiry; }
        public void setExpiry(String expiry) { this.expiry = expiry; }
        public String getCvv() { return cvv; }
        public void setCvv(String cvv) { this.cvv = cvv; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public String getPackageName() { return packageName; }
        public void setPackageName(String packageName) { this.packageName = packageName; }
    }

    @PostMapping("/charge")
    public ResponseEntity<?> chargeCard(@RequestBody PaymentRequest request) {
        if (request.getCardNumber() == null || request.getCardNumber().trim().length() < 16) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Invalid credit card number!"));
        }
        if (request.getAmount() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Invalid transaction amount!"));
        }

        // Simulate secure Stripe/Razorpay gateway processing
        try {
            Thread.sleep(1200); // Simulate transaction round-trip
        } catch (InterruptedException ignored) {}

        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("transactionId", transactionId);
        response.put("message", "Payment charged successfully via Stripe secure gateway.");
        response.put("amount", request.getAmount());
        response.put("packageName", request.getPackageName());
        response.put("receiptUrl", "https://stripe.com/receipts/" + transactionId);

        return ResponseEntity.ok(response);
    }
}
