import { useEffect, useRef } from "react";

interface BlobProps {
  width?: number;
  height?: number;
  color?: string;
  radius?: number;
  style?: React.CSSProperties;
}

export default function Blob({
  width = 300,
  height = 300,
  color = "#C62328",
  radius = 120,
  style = {},
}: BlobProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // --- CLASES DEL BLOB ---
    class Point {
      parent: any;
      azimuth: number;
      _components: { x: number; y: number };
      _acceleration = 0;
      _speed = 0;
      _radialEffect = 0;
      _elasticity = 0.001;
      _friction = 0.0085;

      constructor(azimuth: number, parent: any) {
        this.parent = parent;
        this.azimuth = Math.PI - azimuth;
        this._components = {
          x: Math.cos(this.azimuth),
          y: Math.sin(this.azimuth),
        };
        this.acceleration = -0.3 + Math.random() * 0.6;
      }
      solveWith(leftPoint: any, rightPoint: any) {
        this.acceleration =
          (-0.3 * this.radialEffect +
            (leftPoint.radialEffect - this.radialEffect) +
            (rightPoint.radialEffect - this.radialEffect)) *
            this.elasticity -
          this.speed * this.friction;
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
      set elasticity(value: number) {
        this._elasticity = value;
      }
      get elasticity() {
        return this._elasticity;
      }
      set friction(value: number) {
        this._friction = value;
      }
      get friction() {
        return this._friction;
      }
    }

    class Blob {
      points: any[] = [];
      _color = color;
      _canvas: HTMLCanvasElement | null = null;
      ctx: CanvasRenderingContext2D | null = null;
      _points = 32;
      _radius = radius;
      _position = { x: 0.5, y: 0.5 };
      mousePos: { x: number; y: number } | null = null;

      get numPoints() {
        return this._points;
      }
      get radius() {
        return this._radius;
      }
      get position() {
        return this._position;
      }
      get divisional() {
        return (Math.PI * 2) / this.numPoints;
      }
      get center() {
        if (!this.canvas) return { x: 0, y: 0 };
        return {
          x: this.canvas.width * this.position.x,
          y: this.canvas.height * this.position.y,
        };
      }
      set color(value: string) {
        this._color = value;
      }
      get color() {
        return this._color;
      }
      set canvas(value: HTMLCanvasElement | null) {
        this._canvas = value;
        if (value) this.ctx = value.getContext("2d");
      }
      get canvas() {
        return this._canvas;
      }
      init() {
        this.points = [];
        for (let i = 0; i < this.numPoints; i++) {
          let point = new Point(this.divisional * (i + 1), this);
          this.push(point);
        }
      }
      push(item: any) {
        if (item instanceof Point) {
          this.points.push(item);
        }
      }
      render = () => {
        if (!this.canvas || !this.ctx) return;
        const ctx = this.ctx;
        const pointsArray = this.points;
        const points = this.numPoints;
        const center = this.center;

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
          var xc = (p1.x + p2.x) / 2;
          var yc = (p1.y + p2.y) / 2;
          ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
          p1 = p2;
        }

        var xc = (p1.x + _p2.x) / 2;
        var yc = (p1.y + _p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "#00000000";
        ctx.stroke();

        requestAnimationFrame(this.render);
      };
    }

    // --- INICIALIZACIÓN ---
    const canvas = canvasRef.current;
    if (!canvas) return;

    let blob = new Blob();
    blob.canvas = canvas;
    blob.init();

    // Resize canvas
    const resize = () => {
      canvas.width = width;
      canvas.height = height;
    };
    resize();

    // Mouse interaction
    let oldMousePoint = { x: 0, y: 0 };
    let hover = false;
    const mouseMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      let pos = blob.center;
      let mouseX = e.clientX - rect.left;
      let mouseY = e.clientY - rect.top;
      let diff = { x: mouseX - pos.x, y: mouseY - pos.y };
      let dist = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
      let angle: number | null = null;

      blob.mousePos = { x: pos.x - mouseX, y: pos.y - mouseY };

      if (dist < blob.radius && hover === false) {
        let vector = { x: mouseX - pos.x, y: mouseY - pos.y };
        angle = Math.atan2(vector.y, vector.x);
        hover = true;
      } else if (dist > blob.radius && hover === true) {
        let vector = { x: mouseX - pos.x, y: mouseY - pos.y };
        angle = Math.atan2(vector.y, vector.x);
        hover = false;
        blob.color = color;
      }

      if (typeof angle == "number") {
        let nearestPoint: any = null;
        let distanceFromPoint = 100;
        blob.points.forEach((point: any) => {
          if (Math.abs(angle! - point.azimuth) < distanceFromPoint) {
            nearestPoint = point;
            distanceFromPoint = Math.abs(angle! - point.azimuth);
          }
        });
        if (nearestPoint) {
          let strength = {
            x: oldMousePoint.x - mouseX,
            y: oldMousePoint.y - mouseY,
          };
          let s = Math.sqrt(strength.x * strength.x + strength.y * strength.y) * 10;
          if (s > 100) s = 100;
          nearestPoint.acceleration = (s / 100) * (hover ? -1 : 1);
        }
      }
      oldMousePoint.x = mouseX;
      oldMousePoint.y = mouseY;
    };
    canvas.addEventListener("pointermove", mouseMove);

    blob.render();

    // Cleanup
    return () => {
      canvas.removeEventListener("pointermove", mouseMove);
    };
  }, [width, height, color, radius]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: "block", ...style }}
    />
  );
}
