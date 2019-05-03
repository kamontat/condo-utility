<script>
import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null
    },
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
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
