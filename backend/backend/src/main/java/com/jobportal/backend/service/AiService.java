package com.jobportal.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.Map;
import java.util.List;

@Service
public class AiService {

    private final RestClient restClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    public AiService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent")
                .build();
    }

    public String generateInterviewQuestions(String jobTitle, String jobDescription) {
        String promptText = String.format(
                "Act as a professional technical interviewer. Based on the job title: '%s' " +
                        "and the job description: '%s', generate exactly 5 realistic interview questions. " +
                        "Under each question, provide a 'Short Ideal Answer' restricted to a maximum of 2 sentences. " +
                        "Keep the tone concise, punchy, and easy to skim. Format cleanly with numbers.",
                jobTitle, jobDescription
        );


        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", promptText)
                        ))
                )
        );

        try {

            Map<String, Object> response = restClient.post()
                    .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);


            List<?> candidates = (List<?>) response.get("candidates");
            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
            List<?> parts = (List<?>) content.get("parts");
            Map<?, ?> firstPart = (Map<?, ?>) parts.get(0);

            return (String) firstPart.get("text");

        } catch (Exception e) {
            return "Error generating interview preparation sheet: " + e.getMessage();
        }
    }
}