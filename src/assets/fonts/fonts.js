import { createGlobalStyle } from "styled-components";


import shlopregular from "./shlop-regular.ttf";


export default createGlobalStyle`

@font-face {
  font-family: 'shlop-regular';
  src: url(${shlopregular}) format('truetype');
}
`;