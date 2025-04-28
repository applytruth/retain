package com.applytruth.retain.service;

import com.applytruth.retain.model.KanjiEntry;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Service
public class KanjiService {

    private final ObjectMapper objectMapper;
    private final File kanjiFile;
    private List<KanjiEntry> kanjiList = new ArrayList<>();

    public KanjiService(ObjectMapper objectMapper, @Value("${kanji.file.path}") String kanjiFilePath) {
        this.objectMapper = objectMapper;
        this.kanjiFile = new File(kanjiFilePath);
    }

    @PostConstruct
    public void loadKanjiData() {
        try (FileInputStream inputStream = new FileInputStream(kanjiFile)) {
            this.kanjiList = objectMapper.readValue(
                    inputStream,
                    new TypeReference<List<KanjiEntry>>() {});
        }
        catch (IOException e) {
            throw new RuntimeException("Failed to load Kanji data from file", e);
        }
    }

    public List<KanjiEntry> getAllKanji() {
        return new ArrayList<>(kanjiList);
    }

    public boolean updateKanji(KanjiEntry updatedEntry) {
        System.out.println("Looking for key: " + updatedEntry.getKey());
        System.out.println("Kanji List has " + kanjiList.size() + " elements.");
        Optional<KanjiEntry> existingEntry = kanjiList.stream()
                .filter(entry -> entry.getKey().equals(updatedEntry.getKey()))
                .findFirst();
        System.out.println("Found existing entry:" + existingEntry);
        System.out.println("Updated Entry contains: " + updatedEntry);

        if (existingEntry.isPresent()) {
            KanjiEntry entry = existingEntry.get();
            System.out.println("Found matching key: " + entry.getKey());
            entry.setNumber(updatedEntry.getNumber());
            entry.setChapter(updatedEntry.getChapter());
            entry.setStrokes(updatedEntry.getStrokes());
            entry.setStory(updatedEntry.getStory());
            try {
                boolean result = saveKanjiData(entry);
                return result;
            } catch (IOException e) {
                throw new RuntimeException("Failed to save Kanji data", e);
            }
        } else {
            return false;
        }
    }

    private boolean saveKanjiData(KanjiEntry updatedEntry) throws IOException {
        System.out.println("Attempting to save the updated Kanji List ...");

        Optional<KanjiEntry> existingEntry = kanjiList.stream()
                .filter(entry -> entry.getKey().equals(updatedEntry.getKey()))
                .findFirst();
        System.out.println("Found existing entry:" + existingEntry);

        try {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(kanjiFile, kanjiList);
            System.out.println("✅ Kanji data saved successfully.");
            return true;
        } catch (IOException e) {
            System.err.println("❌ Error saving Kanji data: " + e.getMessage());
            return false;
        }
    }


    public boolean addKanji(KanjiEntry newEntry) {
        Optional<KanjiEntry> existingEntry = kanjiList.stream()
                .filter(entry -> entry.getKey().equals(newEntry.getKey()))
                .findFirst();

        if (!existingEntry.isPresent()) {
            KanjiEntry entry = new KanjiEntry();
            entry.setKey(newEntry.getKey());
            entry.setKanji(newEntry.getKanji());
            entry.setNumber(newEntry.getNumber());
            entry.setChapter(newEntry.getChapter());
            entry.setStrokes(newEntry.getStrokes());
            entry.setStory(newEntry.getStory());
            try {
                saveKanjiData(entry);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save Kanji data", e);
            }
            return true;
        } else {
            return false;
        }
    }
}
