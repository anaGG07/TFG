import { useEffect } from "react";

const BlobBackground = () => {
  useEffect(() => {
    let canvas: HTMLCanvasElement;
    let blob: any;

    class Blob {
      points: any[] = [];
      _color = "#C62828";
      _canvas: HTMLCanvasElement | null = null;
      ctx: CanvasRenderingContext2D | null = null;
      _points = 32;
      _radius = 150;

      get divisional() {
        return (Math.PI * 2) / this.numPoints;
      }

      get center() {
        return {
          x: this.canvas!.width * 0.5,
          y: this.canvas!.height * 0.5,
        };
      }

      set color(value: string) {
        this._color = "#C62828";
      }

      get color() {
        return this._color;
      }

      set canvas(value: HTMLCanvasElement) {
        this._canvas = value;
        this.ctx = value.getContext("2d");
      }

      get canvas() {
        return this._canvas!;
      }

      get numPoints() {
        return this._points;
      }

      set numPoints(value: number) {
        this._points = value;
      }

      get radius() {
        return this._radius;
      }

      set radius(value: number) {
        this._radius = value;
      }

      push(item: any) {
        this.points.push(item);
      }

      init() {
        for (let i = 0; i < this.numPoints; i++) {
          const point = new Point(this.divisional * (i + 1), this);
          this.push(point);
        }
      }

      render() {
        const ctx = this.ctx!;
        const pointsArray = this.points;
        const points = this.numPoints;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        pointsArray[0].solveWith(pointsArray[points - 1], pointsArray[1]);

        let p0 = pointsArray[points - 1].position;
        let p1 = pointsArray[0].position;
        let _p2 = p1;

        ctx.beginPath();
        ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);

        for (let i = 1; i < points; i++) {
          pointsArray[i].solveWith(
            pointsArray[i - 1],
            pointsArray[i + 1] || pointsArray[0]
          );

          let p2 = pointsArray[i].position;
          let xc = (p1.x + p2.x) / 2;
          let yc = (p1.y + p2.y) / 2;
          ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
          p1 = p2;
        }

        let xc = (p1.x + _p2.x) / 2;
        let yc = (p1.y + _p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
          ctx.strokeStyle = this.color;
          console.log("rendering blob");
        ctx.fillStyle = this.color;
        ctx.fill();

        requestAnimationFrame(this.render.bind(this));
      }
    }

    class Point {
      parent: Blob;
      azimuth: number;
      _components: { x: number; y: number };
      _acceleration = 0;
      _speed = 0;
      _radialEffect = 0;

      constructor(azimuth: number, parent: Blob) {
        this.parent = parent;
        this.azimuth = Math.PI - azimuth;
        this._components = {
          x: Math.cos(this.azimuth),
          y: Math.sin(this.azimuth),
        };
        this.acceleration = -0.3 + Math.random() * 0.6;
      }

      get position() {
        return {
          x:
            this.parent.center.x +
            this.components.x * (this.parent.radius + this.radialEffect),
          y:
            this.parent.center.y +
            this.components.y * (this.parent.radius + this.radialEffect),
        };
      }

      get components() {
        return this._components;
      }

      set acceleration(value: number) {
        this._acceleration = value;
        this.speed += this._acceleration * 2;
      }

      get acceleration() {
        return this._acceleration;
      }

      set speed(value: number) {
        this._speed = value;
        this.radialEffect += this._speed * 5;
      }

      get speed() {
        return this._speed;
      }

      set radialEffect(value: number) {
        this._radialEffect = value;
      }

      get radialEffect() {
        return this._radialEffect;
      }

      get elasticity() {
        return 0.001;
      }

      get friction() {
        return 0.0085;
      }

      solveWith(leftPoint: Point, rightPoint: Point) {
        this.acceleration =
          (-0.3 * this.radialEffect +
            (leftPoint.radialEffect - this.radialEffect) +
            (rightPoint.radialEffect - this.radialEffect)) *
            this.elasticity -
          this.speed * this.friction;
      }
    }

    // Inicializar blob
    blob = new Blob();

    canvas = document.createElement("canvas");
    canvas.classList.add(
      "fixed",
      "top-0",
      "left-0",
      "w-screen",
      "h-screen",
      "z-0"
    );
    document.body.appendChild(canvas);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    blob.canvas = canvas;
    blob.init();
    blob.render();

    return () => {
      canvas.remove();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return null;
};

export default BlobBackground;
