package com.applytruth.retain.controller;

import com.applytruth.retain.model.KanjiEntry;
import com.applytruth.retain.service.KanjiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/kanji")
public class KanjiController {

    private final KanjiService kanjiService;

    public KanjiController(KanjiService kanjiService) {
        this.kanjiService = kanjiService;
    }

    @GetMapping
    public ResponseEntity<List<KanjiEntry>> getAllKanji() {
        List<KanjiEntry> kanjiList = kanjiService.getAllKanji();
        return ResponseEntity.ok(kanjiList);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateKanji(@RequestBody KanjiEntry updatedKanji) {
        boolean success = kanjiService.updateKanji(updatedKanji);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).body("Kanji updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kanji not found");
        }
    }

    @PostMapping("/add")
    public ResponseEntity<String> addKanji(@RequestBody KanjiEntry newKanji) {
        boolean success = kanjiService.addKanji(newKanji);
        if (success) {
            return ResponseEntity.status(HttpStatus.OK).body("Kanji added successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kanji not added");
        }
    }

    @ControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(IllegalArgumentException.class)
        @ResponseStatus(HttpStatus.NOT_FOUND)
        @ResponseBody
        public String handleNotFound(IllegalArgumentException ex) {
            return ex.getMessage();
        }
    }
}
