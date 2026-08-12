package com.tripnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherResponse {

    private CurrentWeather current;

    public CurrentWeather getCurrent() { return current; }
    public void setCurrent(CurrentWeather current) { this.current = current; }

    public static WeatherResponseBuilder builder() {
        return new WeatherResponseBuilder();
    }

    public static class WeatherResponseBuilder {
        private CurrentWeather current;

        public WeatherResponseBuilder current(CurrentWeather current) { this.current = current; return this; }
        public WeatherResponse build() {
            WeatherResponse w = new WeatherResponse();
            w.setCurrent(current);
            return w;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CurrentWeather {
        private int temp;
        private String condition;

        public int getTemp() { return temp; }
        public void setTemp(int temp) { this.temp = temp; }

        public String getCondition() { return condition; }
        public void setCondition(String condition) { this.condition = condition; }

        public static CurrentWeatherBuilder builder() {
            return new CurrentWeatherBuilder();
        }

        public static class CurrentWeatherBuilder {
            private int temp;
            private String condition;

            public CurrentWeatherBuilder temp(int temp) { this.temp = temp; return this; }
            public CurrentWeatherBuilder condition(String condition) { this.condition = condition; return this; }
            public CurrentWeather build() {
                CurrentWeather cw = new CurrentWeather();
                cw.setTemp(temp);
                cw.setCondition(condition);
                return cw;
            }
        }
    }
}
