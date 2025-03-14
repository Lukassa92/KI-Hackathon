import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {MessageDto} from "../models/messageDto";
import {HttpClient} from "@angular/common/http";
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  baseUrl = "http://localhost:8000/"
  sessionId = uuid.v4();

  constructor(private httpClient: HttpClient) {
  }


  sendMessage(message: string): Observable<MessageDto> {

    const dto = new MessageDto(message, this.sessionId);

    return this.httpClient.post<MessageDto>(this.baseUrl + 'chat', dto)
  }
}
