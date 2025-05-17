import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LyricsLine {
  text: string;
  chord: string;
}

interface LyricsSection {
  line: LyricsLine[];
}

interface Song {
  id: number;
  title: string;
  artist: string;
  lyrics?: LyricsSection[];  // 修正：明确歌词为LyricsSection数组
}

@Injectable({ providedIn: 'root' })
export class SongService {
  private apiUrl = 'https://api.hf2e2bc54.nyat.app:56647/api/admin';

  constructor(private http: HttpClient) { }

  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/songs`);
  }

  getSongById(id: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/songs/${id}`);
  }

  searchSongs(keyword: string): Observable<Song[]> {
    return this.http.post<Song[]>(`${this.apiUrl}/songs/search`, { keyword });
  }

  // 修改前：返回 Song[]
  // getLyrics(id: number): Observable<Song[]> {
  //   return this.http.get<Song[]>(`${this.apiUrl}/lyrics/${id}`);
  // }

  // 修改后：返回单个 Song 对象
  getLyrics(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/lyrics/${id}`);
  }

  createSong(title: string, artist: string, lyrics: any[]): Observable<{ id: number; message: string }> {
    return this.http.post<{ id: number; message: string }>(`${this.apiUrl}/songs`, { title, artist, lyrics });
  }

  deleteSong(id: number): Observable<{ result: number }> {
    return this.http.delete<{ result: number }>(`${this.apiUrl}/songs/${id}`);
  }

  updateSong(id: number, title: string, artist: string, lyrics: any[]): Observable<{ result: number }> {
    return this.http.put<{ result: number }>(`${this.apiUrl}/songs/${id}`, { title, artist, lyrics });
  }
}