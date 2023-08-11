import {
  Box,
  Grid,
  Input,
  InputProps,
  Slider,
  SliderProps,
  Typography,
} from "@mui/material";
import * as React from "react";

interface TextInputSliderProps {
  title: string;
  value: number;
  sliderProps: SliderProps;
  inputProps: InputProps;
}

export function TextInputSlider(props: TextInputSliderProps) {
  return (
    <Box sx={{ width: "250px" }}>
      <Typography gutterBottom>{props.title}</Typography>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={8}>
          <Slider {...props.sliderProps} value={props.value} />
        </Grid>
        <Grid item xs={4}>
          <Input {...props.inputProps} value={props.value} />
        </Grid>
      </Grid>
    </Box>
  );
}
