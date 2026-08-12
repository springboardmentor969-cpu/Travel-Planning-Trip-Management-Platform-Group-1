package com.tripnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenRefreshResponse {
    private String accessToken;
    private String refreshToken;

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public static TokenRefreshResponseBuilder builder() {
        return new TokenRefreshResponseBuilder();
    }

    public static class TokenRefreshResponseBuilder {
        private String accessToken;
        private String refreshToken;

        public TokenRefreshResponseBuilder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
        public TokenRefreshResponseBuilder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }

        public TokenRefreshResponse build() {
            TokenRefreshResponse t = new TokenRefreshResponse();
            t.setAccessToken(accessToken);
            t.setRefreshToken(refreshToken);
            return t;
        }
    }
}