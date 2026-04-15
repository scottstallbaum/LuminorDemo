(function () {
  if (typeof window.Chart !== "undefined") return;

  function NoopChart(ctx, config) {
    this.ctx = ctx;
    this.config = config || {};
    this.data = this.config.data || {};
    this.options = this.config.options || {};
    this.scales = {
      x: { getValueForPixel: function () { return 0; } },
      y: { getValueForPixel: function () { return 0; } }
    };
    this.chartArea = { left: 0, right: 0, top: 0, bottom: 0 };
  }

  NoopChart.prototype.destroy = function () {
    // No-op fallback when Chart.js CDN is unavailable.
  };

  NoopChart.prototype.update = function () {};
  NoopChart.prototype.resize = function () {};
  NoopChart.prototype.clear = function () {};
  NoopChart.prototype.stop = function () {};

  NoopChart.register = function () {};
  NoopChart.defaults = {};
  NoopChart.overrides = {};
  NoopChart.helpers = {};

  window.Chart = NoopChart;
})();
