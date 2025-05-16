import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SongService } from '../services/song.service';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-song-management',
  templateUrl: './song-management.component.html',
  styleUrl: './song-management.component.css'
})
export class SongManagementComponent {
  songs: any[] = [];
  currentSong: any = null;
  keyword: string = '';
  title: string = '';
  artist: string = '';
  lyrics: any[] = [];
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

  // 添加显示创建对话框的方法
  showCreateDialog(): void {
    this.currentSong = {}; // 设置为非null以触发弹窗
    this.title = '';       // 重置表单字段
    this.artist = '';
    this.lyrics = [];
  }

  // 保持原createSong方法不变，用于表单提交时实际创建歌曲
  createSong(): void {
    this.songService.createSong(this.title, this.artist, this.lyrics).subscribe(
      (result) => {
        this.getSongs();
        this.clearForm(); // 提交成功后关闭弹窗
      },
      (error) => console.error('创建歌曲失败', error)
    );
  }

  updateSong(): void {
    if (!this.currentSong) return;
    this.songService.updateSong(this.currentSong.id, this.title, this.artist, this.lyrics).subscribe(
      (result) => {
        this.getSongs();
        this.clearForm();
      },
      (error) => console.error('更新歌曲失败', error)
    );
  }

  deleteSong(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '确认删除该歌曲吗？' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.songService.deleteSong(id).subscribe(
          (result) => this.getSongs(),
          (error) => console.error('删除歌曲失败', error)
        );
      }
    });
  }

  editSong(song: any): void {
    this.currentSong = song;
    this.title = song.title;
    this.artist = song.artist;
    this.lyrics = song.lyrics;
  }

  clearForm(): void {
    this.currentSong = null;
    this.title = '';
    this.artist = '';
    this.lyrics = [];
    this.keyword = '';
  }
}
