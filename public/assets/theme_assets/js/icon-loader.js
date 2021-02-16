$.getJSON("json/icons.json", function (data) {
  const { faIcons } = data;
  const { laIcons } = data;
  const feIcons = data.featherIcons;
  const colFa = faIcons.map(
    (icon) =>
      `<div className="col-sm-6 col-md-4 col-lg-3">
                    <i className="fas fa-${icon}"></i>
                    <span className="icon-text">${icon}</span>
                </div>
            `
  );

  const colLa = laIcons.map(
    (icon) =>
      `
                <div className="col-sm-6 col-md-4 col-lg-3">
                    <i className="la la-${icon}"></i>
                    <span className="icon-text">${icon}</span>
                </div>
            `
  );

  $(".faIcon-list-box").append(colFa);
  $(".laIcon-list-box").append(colLa);
  const colFe = feIcons.map(
    (icon) =>
      `
                <div className="col-sm-6 col-md-4 col-lg-3">
                    <span data-feather="${icon}"></span>
                    <span className="icon-text">${icon}</span>
                </div>
            `
  );

  $(".feIcon-list-box").append(colFe);
  feather.replace();
});
