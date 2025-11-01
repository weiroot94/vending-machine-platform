import React, {useEffect} from "react";
import classNames from "classnames";

import slideUp from "../../../utilities/slideUp";
import slideDown from "../../../utilities/slideDown";
import getParents from "../../../utilities/getParents";

import {useLayout} from "../LayoutProvider";

import {NavLink, Link} from "react-router-dom";
import {createPopper} from "@popperjs/core";

import {Icon, Media, MediaText, MediaGroup, Image} from "../../../components";

function MenuItemTemplate({text, icon}) {
  return (
    <>
      {icon && (
        <span className="nk-nav-icon">
          <Icon name={icon}></Icon>
        </span>
      )}
      {text && <span className="nk-nav-text">{text}</span>}
    </>
  );
}

function MenuItemLink({
  text,
  icon,
  sub,
  to,
  blank,
  onClick,
  onMouseEnter,
  className,
  ...props
}) {
  const compClass = classNames({
    "nk-nav-link": true,
    "nk-nav-toggle": sub,
    [className]: className,
  });
  return (
    <>
      {!blank && !sub && (
        <NavLink className={compClass} to={to}>
          <MenuItemTemplate icon={icon} text={text} />
          {props.children}
        </NavLink>
      )}
      {blank && (
        <Link className={compClass} to={to} target="_blank">
          <MenuItemTemplate icon={icon} text={text} />
          {props.children}
        </Link>
      )}
      {sub && (
        <a
          className={compClass}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          href="#expand"
        >
          <MenuItemTemplate icon={icon} text={text} />
          {props.children}
        </a>
      )}
    </>
  );
}

function MenuItem({sub, className, ...props}) {
  const compClass = classNames({
    "nk-nav-item": true,
    "has-sub": sub,
    [className]: className,
  });
  return <li className={compClass}>{props.children}</li>;
}

function MenuSub({mega, size, megaSize, className, megaClassName, ...props}) {
  const compClass = classNames({
    "nk-nav-sub": true,
    [`nk-nav-sub-${size}`]: size,
    [className]: className,
  });
  const megaClass = classNames({
    "nk-nav-mega": true,
    [`nk-nav-mega-${megaSize}`]: megaSize,
    [megaClassName]: megaClassName,
  });
  return (
    <>
      {!mega && <ul className={compClass}>{props.children}</ul>}
      {mega && (
        <div className={compClass}>
          <div className={megaClass}>{props.children}</div>
        </div>
      )}
    </>
  );
}

function MenuList({className, ...props}) {
  const compClass = classNames({
    "nk-nav": true,
    [className]: className,
  });
  return <ul className={compClass}>{props.children}</ul>;
}

function Menu() {
  const layout = useLayout();

  // variables for Sidebar
  let menu = {
    classes: {
      main: "nk-nav",
      item: "nk-nav-item",
      link: "nk-nav-link",
      toggle: "nk-nav-toggle",
      sub: "nk-nav-sub",
      subparent: "has-sub",
      active: "active",
      current: "current-page",
    },
  };

  let currentLink = function (selector) {
    let elm = document.querySelectorAll(selector);
    elm.forEach(function (item) {
      var activeRouterLink = item.classList.contains("active");
      if (activeRouterLink) {
        let parents = getParents(
          item,
          `.${menu.classes.main}`,
          menu.classes.item
        );
        parents.forEach((parentElemets) => {
          parentElemets.classList.add(
            menu.classes.active,
            menu.classes.current
          );
          let subItem = parentElemets.querySelector(`.${menu.classes.sub}`);
          subItem !== null && (subItem.style.display = "block");
        });
      } else {
        item.parentElement.classList.remove(
          menu.classes.active,
          menu.classes.current
        );
      }
    });
  };

  // dropdown toggle
  let dropdownToggle = function (elm) {
    let parent = elm.parentElement;
    let nextelm = elm.nextElementSibling;
    let speed =
      nextelm.children.length > 5 ? 400 + nextelm.children.length * 10 : 400;
    if (!parent.classList.contains(menu.classes.active)) {
      parent.classList.add(menu.classes.active);
      slideDown(nextelm, speed);
    } else {
      parent.classList.remove(menu.classes.active);
      slideUp(nextelm, speed);
    }
  };

  // dropdown extended
  let dropdownExtended = function (elm) {
    let nextelm = elm.nextElementSibling;
    let headerCollapse = layout.headerCollapse
      ? layout.headerCollapse
      : layout.breaks.lg;
    // eslint-disable-next-line
    if (window.innerWidth > eval(`layout.breaks.${headerCollapse}`)) {
      let placement =
        getParents(elm, `.${menu.classes.main}`, menu.classes.sub).length > 0
          ? "right-start"
          : "bottom-start";
      createPopper(elm, nextelm, {
        placement: placement,
        boundary: ".nk-wrap",
      });
    }
  };

  // dropdown close siblings
  let closeSiblings = function (elm) {
    let parent = elm.parentElement;
    let siblings = parent.parentElement.children;
    Array.from(siblings).forEach((item) => {
      if (item !== parent) {
        item.classList.remove(menu.classes.active);
        if (item.classList.contains(menu.classes.subparent)) {
          let subitem = item.querySelectorAll(`.${menu.classes.sub}`);
          subitem.forEach((child) => {
            child.parentElement.classList.remove(menu.classes.active);
            slideUp(child, 400);
          });
        }
      }
    });
  };

  let menuToggle = function (e) {
    e.preventDefault();
    let item = e.target.closest(`.${menu.classes.toggle}`);
    dropdownToggle(item);
    closeSiblings(item);
  };

  let menuHover = function (e) {
    e.preventDefault();
    let item = e.target.closest(`.${menu.classes.toggle}`);
    dropdownExtended(item);
  };

  useEffect(() => {
    currentLink(`.${menu.classes.link}`);
    // eslint-disable-next-line
  }, [null]);

  return <></>;
}

export default Menu;
