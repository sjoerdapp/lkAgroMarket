import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { User } from 'firebase';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ForumService } from '../../forum.service';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent implements OnInit {
  commentForm = new FormGroup({
    comment: new FormControl('', Validators.required)
  });

  viewButton = true;
  comments: any[];
  cmntId: any;
  userImageURL;
  currentUser;
  postUser;
  showBtn;

  get comm() {
    return this.commentForm.get('comment');
  }

  @Input() item: any;

  user: User = JSON.parse(localStorage.getItem('user'));
  formControls = this.commentForm.controls;

  @ViewChild('item', { static: false }) accordion;

  toggleMain() {
    this.accordion.toggle();
  }

  constructor(
    private forumService: ForumService
  ) {}

  ngOnInit() {
    if (this.item.userID === this.user.uid) {
      this.showBtn = true;
    } else {
      this.showBtn = false;
    }
    console.log(this.showBtn);
    this.forumService
      .getComment(this.item.key)
      .pipe()
      .subscribe(comments => {
        this.comments = comments;
      });
  }

  // showToast(status) {
  //   // this.toastrService.show('message', { status });
  // }

  onCreate() {
    const comm = this.commentForm.controls.comment.value as string;
    const dateTime = new Date();
    const postID = this.item.key;
    const userId = this.user.uid;
    const userName = this.user.displayName;
    const userImage = this.user.photoURL;

    if (this.commentForm.valid) {
      this.forumService.createComment(
        comm,
        dateTime,
        postID,
        userId,
        userName,
        userImage
      );
      this.comm.setValue('');
      // this.showToast('success');
    } else {
      // this.showToast('danger');
    }
  }
}
