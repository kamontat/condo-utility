<script>
import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  // mixins: [mixins.reactiveProp],
  props: {
    options: {
      type: Object,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "time",
              distribution: "linear",
              time: {
                unit: "hour",
                minUnit: "minute",
                displayFormats: {
                  hour: "D MMM (H:mm)"
                }
              }
            }
          ]
        }
      })
    }
  },
  watch: {
    chartData() {
      console.log('update chart data');
      this.$data._chart.update();
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
