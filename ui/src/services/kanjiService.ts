import axios from 'axios';
import { UpdateResponse } from '../types/UpdateResponse';
import { KanjiEntry } from "../types/kanjiEntry";

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchKanji = async (): Promise<KanjiEntry[]> => {
  const response = await axios.get<KanjiEntry[]>(`${API_BASE_URL}/kanji`);
  return response.data;
};

export const updateKanji = async ( updatedEntry: KanjiEntry): Promise<string> => {
  const response = await axios.put<UpdateResponse>(`${API_BASE_URL}/kanji/update`, updatedEntry);
  return response.data.message;
};
