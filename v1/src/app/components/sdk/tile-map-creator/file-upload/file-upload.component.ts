import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="file-upload-area" 
         [class.drag-over]="isDragOver"
         (dragover)="onDragOver($event)"
         (dragleave)="onDragLeave($event)"
         (drop)="onDrop($event)">
      
      <mat-card class="upload-card">
        <mat-card-content>
          <div class="upload-content">
            <mat-icon class="upload-icon">cloud_upload</mat-icon>
            <h3>Upload Spritesheet</h3>
            <p>Drag and drop a PNG file here, or click to browse</p>
            
            <input #fileInput 
                   type="file" 
                   accept="image/*" 
                   (change)="onFileSelected($event)"
                   style="display: none;">
            
            <button mat-raised-button 
                    color="primary" 
                    (click)="fileInput.click()">
              <mat-icon>folder_open</mat-icon>
              Browse Files
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .file-upload-area {
      padding: 20px;
      transition: all 0.3s ease;
    }

    .file-upload-area.drag-over {
      background: rgba(33, 150, 243, 0.1);
      border-radius: 8px;
    }

    .upload-card {
      text-align: center;
      padding: 40px 20px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .upload-card:hover {
      border-color: #2196f3;
      background: rgba(33, 150, 243, 0.05);
    }

    .drag-over .upload-card {
      border-color: #2196f3;
      background: rgba(33, 150, 243, 0.1);
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .upload-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #666;
    }

    .drag-over .upload-icon {
      color: #2196f3;
    }

    h3 {
      margin: 0;
      color: #333;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    button {
      margin-top: 8px;
    }
  `]
})
export class FileUploadComponent {
  @Input() isDragOver = false;
  @Output() fileSelected = new EventEmitter<File>();
  @Output() dragOverChange = new EventEmitter<boolean>();

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverChange.emit(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverChange.emit(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverChange.emit(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (file.type.startsWith('image/')) {
      this.fileSelected.emit(file);
    }
  }
}
