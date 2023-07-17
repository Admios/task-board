import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/firebase";
import { Box, Button, Flex } from "@chakra-ui/react";
import Canvas from "../components/Canvas";
import { useCanvas } from "../hooks/useCanvas";
import Rectangle from "../components/toolbar/Rectangle";

const Login = () => {
  const { ctx, canvas, addDrawElement, addRectangle } = useCanvas();
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

  const addShapes = () => {
    if (!ctx) return;
    const tbRectangle = new Rectangle(ctx, 30, 50, 20, 20, true);
    addRectangle(tbRectangle);
  };

  const drawToolbar = () => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.rect(20, 20, 200, window.innerHeight * 0.75);
    ctx.stroke();
    ctx.font = "15px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Toolbox", 30, 40);
  };

  useEffect(() => {
    if (canvas) {
      addDrawElement({ drawBg: drawBackground });
      addDrawElement({ drawToolbar: drawToolbar });
      addShapes();
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
