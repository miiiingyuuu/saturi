package com.tunapearl.saturi.config;

import com.tunapearl.saturi.domain.user.AgeRange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class UserInfoConfig {

    @Bean
    public Map<String, AgeRange> ageRanges() {
        Map<String, AgeRange> ageRanges = new HashMap<>();
        ageRanges.put("1~9", AgeRange.CHILD);
        ageRanges.put("10~14", AgeRange.TEENAGER);
        ageRanges.put("15~19", AgeRange.TEENAGER);
        ageRanges.put("20~29", AgeRange.TWENTEEN);
        ageRanges.put("30~39", AgeRange.THIRTEEN);
        ageRanges.put("40~49", AgeRange.FOURTEEN);
        ageRanges.put("50~59", AgeRange.FOURTEEN);
        ageRanges.put("60~69", AgeRange.SIXTEEN);
        ageRanges.put("70~79", AgeRange.SEVENTEEN);
        ageRanges.put("80~89", AgeRange.EIGHTEEN);
        ageRanges.put("90~", AgeRange.NINETEEN);
        return ageRanges;
    }
}
