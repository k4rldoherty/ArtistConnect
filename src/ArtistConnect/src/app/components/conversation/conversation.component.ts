import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  user1!: string;
  user2!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
  }
  
}
