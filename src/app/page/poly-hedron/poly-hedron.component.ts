import { AfterViewInit, Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { I3dmap } from '../../interfaces';
import { DataService } from '../../data.service';
import * as THREE from 'three';
import { API } from '../../../api';


@Component({
  selector: 'app-poly-hedron',
  templateUrl: './poly-hedron.component.html',
  styleUrls: ['./poly-hedron.component.css']
})
export class PolyHedronComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  //Cube Properties
  @Input() public rotationSpeedX: number = 0.005;
  @Input() public rotationSpeedY: number = 0.005;
  @Input() public size: number = 200;
  @Input() public texture: string = '/assets/texture.jfif';
  @Input() public cameraZ: number = 400;
  @Input() public fieldOfView: number = 1;
  @Input('nearClipping') public nearClippingPlane: number = 1;//we can use this neaClippingplane and farClippingPlane to render properly only the buildings we need in our view so easier on less powerful devices 
  @Input('farClipping') public farClippingPlane: number = 1000;
  

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private loader = new THREE.TextureLoader();
  /*
  const verticesOfCube = [
    -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
    -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
  ];

  const indicesOfFaces = [
      2,1,0,    0,3,2,
      0,4,7,    7,3,0,
      0,1,5,    5,4,0,
      1,2,6,    6,5,1,
      2,3,7,    7,6,2,
      4,5,6,    6,7,4
  ];

  const geometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 6, 2 );
  */
  // verticesOfCube: number[] = [
  //   -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
  //   -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
  // ];
  verticesOfCube: any[]=[];

  indicesOfFaces: any[] = [];
  

  radius: number = 1;
  details: number = 0; 

  

  // indicesOfFaces: number[] = [
  //     2,1,0,    0,3,2,
  //     0,4,7,    7,3,0,
  //     0,1,5,    5,4,0,
  //     1,2,6,    6,5,1,
  //     2,3,7,    7,6,2,
  //     4,5,6,    6,7,4
  // ];
  private geometry = new THREE.PolyhedronGeometry( this.verticesOfCube, this.indicesOfFaces, this.radius, this.details );
  private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

   /** 
  *Create the scene
  *
  *@private
  *@memberof PolyHedronComponent
  */
  private createScene(){
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000)
    this.scene.add(this.cube);

    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = this.cameraZ;
    
  }

  private getAspectRatio(){
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * 
   * 
   * @private
   * @memberof PolyHedronComponent
   */

  private animateCube(){
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }


  /**
   * 
   * @private
   * @memberof PolyHedronComponent
   */

  private startRenderingLoop(){
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  

    let component: PolyHedronComponent = this;
    (function render(){
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit(): void {
    
  }

  update(){
    this.dataService.FireGET<I3dmap>(API.i3dcomp).subscribe(result =>{
      this.verticesOfCube = result.vertices,
      this.indicesOfFaces = result.indices,
      this.radius = result.radius,
      this.details = result.details
    });
    console.log(this.verticesOfCube);
  }

  ngAfterViewInit(){
    this.createScene();
    this.startRenderingLoop();
  }

}
