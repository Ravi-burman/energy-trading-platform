import { Component, OnInit } from '@angular/core';
import { MessageService } from "primeng/api";
interface Person {
  id: String;
  name: String;
  age: number;
}

@Component({
  selector: 'app-generator-grouping',
  templateUrl: './generator-grouping.component.html',
  styleUrls: ['./generator-grouping.component.scss']
})
export class GeneratorGroupingComponent {
  constructor(private msg: MessageService) {}
    available: Person[] = [];
    selected: Person[] = [];
    collapsed: boolean = false;
 
    currentlyDragging: Person | null = null;
 
    ngOnInit() {
        this.available = [
            {
                id: "ASDF12",
                name: "Sandeep Jain Sir",
                age: 38
            },
            {
                id: "KJHY45",
                name: "Shivangi Goel",
                age: 20
            },
            {
                id: "LKIO34",
                name: "Harshit Khandelwal",
                age: 30
            },
            {
                id: "LPOI21",
                name: "Taranjeet Singh",
                age: 25
            },
            {
                id: "VANI12",
                name: "Vanishka Singh",
                age: 23
            }
        ];
    }
 
    // On Drag Start
    dragStart(person: Person) {
        this.currentlyDragging = person;
 
        // Show the toast message on the frontend
        // this.msg.add({
        //     severity: "info",
        //     summary: "Drag Started",
        //     detail: "onDragStart Event"
        // });
    }
 
    drag() {
        // Show the toast message on the frontend
        // this.msg.add({
        //     severity: "success",
        //     summary: "Dragging...",
        //     detail: "onDrag Event"
        // });
    }
 
    // On Drag End
    dragEnd() {
        this.currentlyDragging = null;
        // Show the toast message on the frontend
        this.msg.add({
            severity: "error",
            summary: "Drag End",
            detail: "onDragEnd Event"
        });
    }
 
    // On Drop of Item to droppable area
    drop() {
        if (this.currentlyDragging) {
            let currentlyDraggingIndex = this.findIndex(this.currentlyDragging);
            this.selected = [...this.selected, this.currentlyDragging];
            this.available = this.available.filter(
                (val, i) => i != currentlyDraggingIndex
            );
            this.currentlyDragging = null;
        }
    }
 
    // Find the Index of a Person
    findIndex(person: Person) {
        let index = -1;
        for (let i = 0; i < this.available.length; i++) {
            if (person.id === this.available[i].id) {
                index = i;
                break;
            }
        }
        return index;
    }
    start(){
      this.collapsed = !this.collapsed;
    }
    allowDrop(event: any) {
      event.preventDefault();
  }
  }