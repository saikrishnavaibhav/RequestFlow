import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {

  @Output() files:EventEmitter<any> = new EventEmitter();

  @HostBinding("style.background")
  private background = "#eee";

  constructor(private domSanitizer: DomSanitizer) { }

  @HostListener("dragover", ["$event"])
  public onDragOver(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.background="#999";
  }

  @HostListener("dragleave", ["$event"])
  public onDragLeave(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.background="#eee";
  }

  @HostListener("drop", ["$event"])
  public onDrop(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.background="#eee";
    const file:any = evt.dataTransfer?.files[0];
    this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    this.files.emit(file);
  }

}
