import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/firebase";
import { Box, Button, Container, Flex } from "@chakra-ui/react";
import Canvas from "../components/Canvas";
import { useCanvas } from "../hooks/useCanvas";

const Login = () => {
  const { canvas, addDrawElement } = useCanvas();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "white";
    const canvas = ctx.canvas;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawToolbarShapes = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.rect(30, 50, 20, 20);
    ctx.stroke();
  };

  const drawToolbar = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.rect(20, 20, 200, window.innerHeight * 0.75);
    ctx.stroke();
    ctx.font = "15px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Toolbox", 30, 40);
    drawToolbarShapes(ctx);
  };

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawBackground(ctx);
    drawToolbar(ctx);
  };

  let getMouseCoords = (event: MouseEvent) => {
    if (!canvas) return;
    let canvasCoords = canvas.getBoundingClientRect();
    return {
      x: event.pageX - canvasCoords.left,
      y: event.pageY - canvasCoords.top,
    };
  };

  let getOffsetCoords = (mouse: any, rect: any) => {
    return {
      x: mouse.x - rect.x,
      y: mouse.y - rect.y,
    };
  };

  const addHandlers = () => {
    if (!canvas) return;
    canvas.addEventListener("mousedown", (e) => {
      let mouse = getMouseCoords(e);
      debugger;
    });
  };

  useEffect(() => {
    if (canvas) {
      addDrawElement({ drawBg: drawBackground });
      addDrawElement({ drawToolbar: drawToolbar });
    }
  }, [canvas]);

  return (
    <Box w={"100vw"} h={"100vh"}>
      <Flex flexDirection={"column"}>
        <Box>
          <Button onClick={handleLogout}>Logout</Button>
        </Box>
        <Box>
          <Canvas />
        </Box>
      </Flex>
    </Box>
  );
};

export default Login;
