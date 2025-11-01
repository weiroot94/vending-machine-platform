import classNames from "classnames";

function Image({src, alt, staticImage, className, fluid, thumbnail}) {
  const compClass = classNames({
    [className]: className,
    [`img-fluid`]: fluid,
    [`img-thumbnail`]: thumbnail,
  });

  // when relative URL, public_url should be appended
  const absoluteUrlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
  if (!absoluteUrlRegex.test(src))
    src = process.env.PUBLIC_URL + src;

  return (
    <>
      {!staticImage && (
        <img
          src={src}
          alt={alt || ""}
          style={{
            border: "1px solid grey",
            padding: "1px",
            borderRadius: "3px",
            height: "100%",
          }}
          className={compClass}
        />
      )}
      {staticImage && (
        <img
          src={src}
          alt={alt || ""}
          className={compClass}
          style={{height: "100%"}}
          onError={(event) => console.log(event.target)}
        />
      )}
    </>
  );
}

export default Image;
