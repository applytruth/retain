package com.applytruth.retain.model;

import lombok.Data;

@Data
public class KanjiEntry {
    private int number;
    private int chapter;
    private int strokes;
    private String key;
    private String kanji;
    private String story;
}
