import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  standalone: true,
  name: 'convertLinks'
})
export class ConvertLinksPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return value;

    // Markdown-Links [Text](URL) in <a>-Tags umwandeln
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let converted = value.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Zeilenumbrüche (\n) in <br> umwandeln
    converted = converted.replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(converted);
  }
}
