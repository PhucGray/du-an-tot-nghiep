// type ScriptName =
//   | 'pdfjsLib'
//   | 'PDFLib'
//   | 'download'
//   | 'makeTextPDF'
//   | 'w3Color';

// interface Script {
//   name: ScriptName;
//   src: string;
// }

const scripts = [
  {
    name: "pdfjsLib",
    src: "https://unpkg.com/pdfjs-dist@2.3.200/build/pdf.min.js",
  },
  {
    name: "PDFLib",
    src: "https://unpkg.com/pdf-lib@1.4.0/dist/pdf-lib.min.js",
  },
  {
    name: "download",
    src: "https://unpkg.com/downloadjs@1.4.7",
  },
  {
    name: "makeTextPDF",
    src: "https://cdn.jsdelivr.net/gh/snamoah/react-pdf-editor/public/makeTextPDF.js",
  },
  { name: "w3Color", src: "https://www.w3schools.com/lib/w3color.js" },
];

const assets = {};
export const getAsset = (scriptName) => {
  prepareAssets();

  return assets[scriptName];
};

export const prepareAssets = () => {
  // prepare scripts
  scripts.forEach(({ name, src }) => {
    assets[name] = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(window[name]);
        // console.log(`${name} is loaded.`);
      };
      script.onerror = () =>
        reject(`The script ${name} didn't load correctly.`);
      document.body.appendChild(script);
    });
  });
};

// interface Font {
//   src?: string;
//   correction?: (size: number, lineHeight: number) => number;
//   [key: string]: any;
// }

// interface FontsType {
//   [key: string]: Font;
// }

const fonts = {
  Courier: {
    correction(size, lineHeight) {
      return (size * lineHeight - size) / 2 + size / 6;
    },
  },
  Helvetica: {
    correction(size, lineHeight) {
      return (size * lineHeight - size) / 2 + size / 10;
    },
  },
  "Times-Roman": {
    correction(size, lineHeight) {
      return (size * lineHeight - size) / 2 + size / 7;
    },
  },
};

// Available fonts
export const Fonts = {
  ...fonts,
  標楷體: {
    src: "/CK.ttf", // 9.9 MB
    correction(size, lineHeight) {
      return (size * lineHeight - size) / 2;
    },
  },
};

export const fetchFont = (name) => {
  if (fonts[name]) return fonts[name];

  const font = Fonts[name];
  if (!font) throw new Error(`Font '${name}' not exists.`);

  fonts[name] = fetch(font.src)
    .then((r) => r.arrayBuffer())
    .then((fontBuffer) => {
      const fontFace = new window.FontFace(name, fontBuffer);
      fontFace.display = "swap";
      fontFace.load().then(() => document.fonts.add(fontFace));
      return {
        ...font,
        buffer: fontBuffer,
      };
    });
};
