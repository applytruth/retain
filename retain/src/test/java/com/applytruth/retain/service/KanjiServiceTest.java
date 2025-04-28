package com.applytruth.retain.service;

import com.applytruth.retain.model.KanjiEntry;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class KanjiServiceTest {

    private KanjiService kanjiService;
    private File tempFile;

    @BeforeEach
    void setUp() throws IOException {
        tempFile = Files.createTempFile("kanji-test", ".json").toFile();
        ObjectMapper objectMapper = new ObjectMapper();

        List<KanjiEntry> sampleData = new ArrayList<>();
        KanjiEntry entry = new KanjiEntry();
        entry.setKey("one");
        entry.setNumber(1);
        entry.setChapter(0);
        entry.setStrokes(1);
        entry.setStory("The first kanji.");
        sampleData.add(entry);

        // Write sample data to the temp file
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(tempFile, sampleData);

        // ✅ Correct: Pass tempFile.getAbsolutePath() to the service
        kanjiService = new KanjiService(objectMapper, tempFile.getAbsolutePath());

        // ✅ Then load
        kanjiService.loadKanjiData();
    }



    @AfterEach
    void tearDown() {
        if (tempFile.exists()) {
            tempFile.delete();
        }
    }

    @Test
    void testLoadKanjiData() {
        List<KanjiEntry> kanjiList = kanjiService.getAllKanji();
        assertNotNull(kanjiList);
        assertFalse(kanjiList.isEmpty());
        assertEquals("one", kanjiList.get(0).getKey());
    }

    @Test
    void testUpdateKanji() {
        KanjiEntry updatedEntry = new KanjiEntry();
        updatedEntry.setKey("one");
        updatedEntry.setNumber(100);  // New number
        updatedEntry.setChapter(1);
        updatedEntry.setStrokes(2);
        updatedEntry.setStory("Updated story.");

        boolean result = kanjiService.updateKanji(updatedEntry);
        assertTrue(result);

        List<KanjiEntry> kanjiListAfterUpdate = kanjiService.getAllKanji();
        KanjiEntry updatedKanji = kanjiListAfterUpdate.get(0);
        assertEquals(100, updatedKanji.getNumber());
        assertEquals("Updated story.", updatedKanji.getStory());
    }
}
