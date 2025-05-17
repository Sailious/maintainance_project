import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SongService } from '../services/song.service';

interface LyricsLine {
  text: string;
  chord: string;
}

interface LyricsSection {
  line: LyricsLine[];
}

@Component({
  selector: 'app-song-management',
  templateUrl: './song-management.component.html',
  styleUrl: './song-management.component.css'
})
export class SongManagementComponent {
  songs: any[] = [];
  currentSong: any = undefined;
  keyword: string = '';
  title: string = '';
  artist: string = '';
  lyrics: LyricsSection[] = [];
  lyricsText: string = '';  // 用于textarea的字符串绑定
  searchType: string = '';

  constructor(private songService: SongService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getSongs();
  }

  getSongs(): void {
    this.songService.getSongs().subscribe(
      (songs) => this.songs = songs,
      (error) => console.error('获取歌曲失败', error)
    );
  }

  searchSongs(): void {
    if (!this.keyword) return;
    this.songService.searchSongs(this.keyword).subscribe(
      (songs) => this.songs = songs,
      (error) => console.error('搜索歌曲失败', error)
    );
  }

  showCreateDialog(): void {
    this.currentSong = null;
    this.title = '';
    this.artist = '';
    this.lyrics = [];
    this.lyricsText = '';  // 新建时清空文本
  }

  // 合并重复的createSong方法（仅保留一个）
  createSong(): void {
    this.lyrics = this.parseLyricsText(this.lyricsText);  // 提交前解析文本
    this.songService.createSong(this.title, this.artist, this.lyrics).subscribe(
      (result) => {
        this.getSongs();
        this.clearForm();
      },
      (error) => console.error('创建歌曲失败', error)
    );
  }

  // 合并重复的updateSong方法（仅保留一个）
  updateSong(): void {
    if (!this.currentSong) return;
    this.lyrics = this.parseLyricsText(this.lyricsText);  // 提交前解析文本
    this.songService.updateSong(this.currentSong.id, this.title, this.artist, this.lyrics).subscribe(
      (result) => {
        this.getSongs();
        this.clearForm();
      },
      (error) => console.error('更新歌曲失败', error)
    );
  }

  deleteSong(id: number): void {
    if (window.confirm('确认删除该歌曲吗？')) {
      this.songService.deleteSong(id).subscribe(
        (result) => this.getSongs(),
        (error) => console.error('删除歌曲失败', error)
      );
    }
  }

  editSong(song: any): void {
    this.currentSong = song;
    this.title = song.title;
    this.artist = song.artist;
    this.songService.getLyrics(song.id).subscribe(
      (songWithLyrics) => {
        this.lyrics = songWithLyrics.lyrics || [];
        this.lyricsText = this.getLyricsText(this.lyrics);  // 将对象转为文本显示
      },
      (error) => console.error('获取歌词失败', error)
    );
  }

  clearForm(): void {
    this.currentSong = undefined;
    this.title = '';
    this.artist = '';
    this.lyrics = [];
    this.lyricsText = '';
    this.keyword = '';
  }

  // 新增：将歌词对象转为文本的方法
  // 修改：将歌词对象转为格式化的JSON字符串
  getLyricsText(lyrics: LyricsSection[]): string {
    return JSON.stringify(lyrics, null, 2);  // 第二个参数为null（不过滤），第三个参数为2（缩进空格数）
  }

  // 修改：将文本解析为歌词对象（直接解析JSON）
  parseLyricsText(text: string): LyricsSection[] {
    try {
      return JSON.parse(text);  // 直接解析用户输入的JSON字符串
    } catch (error) {
      console.error('解析歌词JSON失败', error);
      return [];  // 解析失败时返回空数组
    }
  }
}
