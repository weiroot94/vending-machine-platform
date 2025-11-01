import i18next from "i18next";
import en from "./i18n/en";
import de from "./i18n/de";

i18next.addResourceBundle("en", "layout2", en);
i18next.addResourceBundle("de", "layout2", de);

const config = {
  title: "Layout 2 - Horizontal",
  defaults: {
    mode: "container",
    containerWidth: 1120,
    navbar: {
      display: true,
      style: "fixed",
    },
    toolbar: {
      display: true,
      style: "fixed",
      position: "below",
    },
    footer: {
      display: true,
      style: "static",
    },
    leftSidePanel: {
      display: true,
    },
    rightSidePanel: {
      display: true,
    },
  },
  form: {
    mode: {
      title: "Mode",
      type: "radio",
      options: [
        {
          name: "Boxed",
          value: "boxed",
        },
        {
          name: "Full Width",
          value: "fullwidth",
        },
        {
          name: "Container",
          value: "container",
        },
      ],
    },
    containerWidth: {
      title: "Container Width (px)",
      type: "number",
    },
    navbar: {
      type: "group",
      title: "Navbar",
      children: {
        display: {
          title: "Display",
          type: "switch",
        },
        style: {
          title: "Style",
          type: "radio",
          options: [
            {
              name: "Fixed",
              value: "fixed",
            },
            {
              name: "Static",
              value: "static",
            },
          ],
        },
      },
    },
    toolbar: {
      type: "group",
      title: "Toolbar",
      children: {
        display: {
          title: "Display",
          type: "switch",
        },
        position: {
          title: "Position",
          type: "radio",
          options: [
            {
              name: "Above",
              value: "above",
            },
            {
              name: "Below",
              value: "below",
            },
          ],
        },
        style: {
          title: "Style",
          type: "radio",
          options: [
            {
              name: "Fixed",
              value: "fixed",
            },
            {
              name: "Static",
              value: "static",
            },
          ],
        },
      },
    },
    footer: {
      type: "group",
      title: "Footer",
      children: {
        display: {
          title: "Display",
          type: "switch",
        },
        style: {
          title: "Style",
          type: "radio",
          options: [
            {
              name: "Fixed",
              value: "fixed",
            },
            {
              name: "Static",
              value: "static",
            },
          ],
        },
      },
    },
  },
};

export default config;
