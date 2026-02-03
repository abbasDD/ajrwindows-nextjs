import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

import {
  CustomFabricObject,
  ElementDirection,
  ImageUpload,
  ModifyShape,
} from "@/types/canva-types";
export const createArchitecturalElement = (
  shapeType: string,
  pointer: { x: number; y: number },
) => {
  const commonProps = {
    left: pointer.x,
    top: pointer.y,
    strokeWidth: 3,
    stroke: "#222",
    objectId: uuidv4(),
    type: "rect",
  };

  let element;

  switch (shapeType) {
    case "single":
    case "single-arched":
      element = new fabric.Rect({
        ...commonProps,
        width: 100,
        height: 210,
        fill: "#66534a",
      } as CustomFabricObject<fabric.Rect>);
      break;

    case "double":
    case "double-arched":
      element = new fabric.Rect({
        ...commonProps,
        width: 200,
        height: 210,
        fill: "#5c4a41",
      } as CustomFabricObject<fabric.Rect>);
      break;

    case "transom":
      element = new fabric.Rect({
        ...commonProps,
        width: 100,
        height: 50,
        fill: "rgba(135, 206, 235, 0.6)",
      } as CustomFabricObject<fabric.Rect>);
      break;

    case "standard-window":
    case "picture-window":
      element = new fabric.Rect({
        ...commonProps,
        width: 120,
        height: 120,
        fill: "rgba(173, 216, 230, 0.4)",
        stroke: "#000",
        strokeWidth: 4,
      } as CustomFabricObject<fabric.Rect>);
      break;

    case "double-hung":
      element = new fabric.Rect({
        ...commonProps,
        width: 100,
        height: 160,
        fill: "rgba(173, 216, 230, 0.3)",
        stroke: "#000",
        strokeWidth: 5,
      } as CustomFabricObject<fabric.Rect>);
      break;

    default:
      return null;
  }

  return element;
};
export const createRectangle = (pointer: PointerEvent) => {
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Rect>);

  return rect;
};

export const createTriangle = (pointer: PointerEvent) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>);
};

export const createCircle = (pointer: PointerEvent) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: "#aabbcc",
    objectId: uuidv4(),
  } as any);
};

export const createLine = (pointer: PointerEvent) => {
  return new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: "#aabbcc",
      strokeWidth: 2,
      objectId: uuidv4(),
    } as CustomFabricObject<fabric.Line>,
  );
};

export const createText = (pointer: PointerEvent, text: string) => {
  return new fabric.IText(text, {
    left: pointer.x,
    top: pointer.y,
    fill: "#aabbcc",
    fontFamily: "Helvetica",
    fontSize: 36,
    fontWeight: "400",
    objectId: uuidv4(),
  } as fabric.ITextOptions);
};

export const createSpecificShape = (
  shapeType: string,
  pointer: PointerEvent,
) => {
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer);

    case "triangle":
      return createTriangle(pointer);

    case "circle":
      return createCircle(pointer);

    case "line":
      return createLine(pointer);

    case "text":
      return createText(pointer, "Tap to Type");

    default:
      return null;
  }
};

export const handleImageUpload = ({
  file,
  canvas,
  shapeRef,
  syncShapeInStorage,
}: ImageUpload) => {
  const reader = new FileReader();

  reader.onload = () => {
    fabric.Image.fromURL(reader.result as string, (img) => {
      img.scaleToWidth(200);
      img.scaleToHeight(200);

      canvas.current.add(img);

      // @ts-ignore
      img.objectId = uuidv4();

      shapeRef.current = img;

      syncShapeInStorage(img);
      canvas.current.requestRenderAll();
    });
  };

  reader.readAsDataURL(file);
};

export const createShape = (
  canvas: fabric.Canvas,
  pointer: PointerEvent,
  shapeType: string,
) => {
  if (shapeType === "freeform") {
    canvas.isDrawingMode = true;
    return null;
  }

  return createSpecificShape(shapeType, pointer);
};

export const modifyShape = ({
  canvas,
  property,
  value,
  activeObjectRef,
  syncShapeInStorage,
}: ModifyShape) => {
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  // if  property is width or height, set the scale of the selected element
  if (property === "width") {
    selectedElement.set("scaleX", 1);
    selectedElement.set("width", value);
  } else if (property === "height") {
    selectedElement.set("scaleY", 1);
    selectedElement.set("height", value);
  } else {
    if (selectedElement[property as keyof object] === value) return;
    selectedElement.set(property as keyof object, value);
  }

  // set selectedElement to activeObjectRef
  activeObjectRef.current = selectedElement;

  syncShapeInStorage(selectedElement);
};

export const bringElement = ({
  canvas,
  direction,
  syncShapeInStorage,
}: ElementDirection) => {
  if (!canvas) return;

  // get the selected element. If there is no selected element or there are more than one selected element, return
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;

  // bring the selected element to the front
  if (direction === "front") {
    canvas.bringToFront(selectedElement);
  } else if (direction === "back") {
    canvas.sendToBack(selectedElement);
  }

  // canvas.renderAll();
  syncShapeInStorage(selectedElement);

  // re-render all objects on the canvas
};

export const createCustomWindowsImage = (
  type: string,
  pointer: { x: number; y: number },
  callback: (img: fabric.Image) => void,
) => {
  const imageMap: Record<string, string> = {
    glass1: "/glass/glass1.jpg",
    glass2: "/glass/glass2.jpg",
  };

  const url = imageMap[type] || "/assets/default.png";

  fabric.Image.fromURL(url, (img) => {
    img.set({
      left: pointer.x,
      top: pointer.y,
      originX: "left",
      originY: "top",
    });

    // Set initial size
    img.scaleToWidth(100);

    // Assign the ID here just like your upload logic
    // @ts-ignore
    img.objectId = uuidv4();
    // img.windowType = type;

    callback(img);
  });
};
