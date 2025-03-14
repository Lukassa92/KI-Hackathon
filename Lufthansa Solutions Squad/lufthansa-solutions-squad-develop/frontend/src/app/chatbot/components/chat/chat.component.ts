import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ChatService} from "../../services/chat.service";
import {ConvertLinksPipe} from '../../pipes/convert-links-pipe.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, DatePipe, NgIf, NgForOf, NgOptimizedImage, ConvertLinksPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements AfterViewChecked {

  @ViewChild('scrollContainer')
  private scrollContainer!: ElementRef;

  messages: { content: string, isUser: boolean, timestamp: Date }[] = [];
  newMessage = '';
  shouldScroll = true;
  isLoading = false;
  error: string | null = null;
  message = '';
  response: string | null = null;

  constructor(private chatService: ChatService) {
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  sendMessage() {

    if (this.newMessage.trim() && !this.isLoading) {

      this.isLoading = true;
      this.error = null;
      this.response = null;

      // Add message to chat
      this.messages.push({
        content: this.newMessage,
        isUser: true,
        timestamp: new Date()
      });

      this.chatService.sendMessage(this.newMessage).subscribe({
        next: (message) => {
          this.isLoading = false;

          this.messages.push({
            content: message.message,
            isUser: false,
            timestamp: new Date()
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.error = 'Failed to send message. Please try again.';
        }
      });

      this.newMessage = '';
    }
  }

  retry() {
    this.sendMessage();
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop =
          this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
    }
  }

  onScroll() {
    // Disable auto-scroll if user scrolls up
    const element = this.scrollContainer.nativeElement;
    this.shouldScroll = element.scrollHeight - element.clientHeight <= element.scrollTop + 1;
  }
}
