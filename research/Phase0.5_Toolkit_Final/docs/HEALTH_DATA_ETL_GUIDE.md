
# Health Data ETL Guide

## Overview
This guide details how to extract, transform, and load (ETL) health and nutrition data into the Phase 0.5 Toolkit.

## Steps
1. **Apple Health Data**
   - Install Health Auto Export (iOS) to automatically push Apple Health data to a server or Nextcloud.
   - Configure exports in JSON or CSV format.

2. **Glucose Data**
   - For Continuous Glucose Monitoring (CGM), set up [Nightscout](https://www.nightscout.info/) for self-hosted data collection.
   - Export readings to InfluxDB or Prometheus.

3. **Thyroid and Lab Metrics**
   - Maintain a manual log (CSV) of lab results (TSH, T3, T4).
   - Automate ingestion by parsing these CSVs with `extended_merge_metrics.py`.

4. **Nutrition Logs**
   - Use `nutrition_log.csv` for daily food intake.
   - Add macros (protein, fat, carbs) and calories for daily summaries.

## Visualization
- Create Grafana panels for health trends, including:
  - Steps vs. calories burned.
  - Glucose levels vs. meal times.
  - Weight and body measurements.
