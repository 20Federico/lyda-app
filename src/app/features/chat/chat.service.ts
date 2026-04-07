import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ResponseBase } from './interfaces/responseBase';
import { AiModelDto } from './interfaces/aiModels';
import { ChatSummaryDto } from './interfaces/chatItem';
import { ProjectDto } from './interfaces/projectItem';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  getAiModels(): Observable<AiModelDto[]> {
    return this.http.get<AiModelDto[]>('/ai-models');
  }

  getChatList(chatStart: number, chatEnd: number): Observable<ChatSummaryDto[]> {
    const params = { chatStart: chatStart, chatEnd: chatEnd };
    return this.http.get<ChatSummaryDto[]>('/chats', { params });
  }

  getProjectList(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>('/projects');
  }
}
