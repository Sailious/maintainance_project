import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SongService } from '../services/song.service';
import { Router } from '@angular/router'; // 新增：导入路由模块

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

  constructor(
    private songService: SongService,
    private dialog: MatDialog,
    private router: Router // 新增：注入路由服务
  ) { }

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
      (response) => {
        // 处理API返回的数组结构
        // 假设 response 是一个数组,且元素类型为 Song，这里需要先判断数组是否有元素
        let songData;
        if (Array.isArray(response) && response.length > 0) {
          songData = response[0];
        } else {
          songData = undefined;
        }
        this.lyrics = songData?.lyrics || [];

        // 使用自定义序列化
        this.lyricsText = this.getLyricsText(this.lyrics);
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
    // 使用JSON.stringify生成标准JSON（带缩进）
    return JSON.stringify(lyrics, null, 2);
  }


  // 将用户输入的类JS对象格式转为合法JSON
  // 将用户输入的JSON文本转为LyricsSection数组
  parseLyricsText(text: string): LyricsSection[] {
    try {
      // 直接解析标准JSON（无需正则替换）
      return JSON.parse(text);
    } catch (error) {
      console.error('解析歌词失败', error);
      return [];
    }
  }

  // 新增：退出登录方法
  onLogout(): void {
    // 示例逻辑：跳转到登录页（根据项目实际需求调整）
    this.router.navigate(['/login']);
    // 如果有认证服务，可在此调用退出逻辑（如：this.authService.logout()）
  }
}
