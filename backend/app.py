from flask import Flask, jsonify
from flask_cors import CORS
from influxdb_client import InfluxDBClient

# ----------------- Flask App -----------------
app = Flask(__name__)
CORS(app)

# ----------------- InfluxDB Config -----------------
INFLUX_URL = "https://us-east-1-1.aws.cloud2.influxdata.com"
INFLUX_TOKEN = "XOKPqtH_yfgLJThY1QBoUINIkEKOxuaM63VwdBl9hZuHi_fe2eVjOfoCv_F_Qh-zUrVOMdE7gKlUbPw5tQzf5g=="
ORG = "2ddddcf97b34592f"
BUCKET = "waste"

client = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=ORG)
query_api = client.query_api()


# ----------------- Debug Endpoints -----------------
@app.route("/api/debug/schema", methods=["GET"])
def debug_schema():
    """Check what measurements and fields are available"""
    try:
        # Get all measurements
        measurements_query = f'''
            import "influxdata/influxdb/schema"
            schema.measurements(bucket: "{BUCKET}")
        '''
        measurements = []
        measurements_result = query_api.query(measurements_query)
        for table in measurements_result:
            for record in table.records:
                measurements.append(record.get_value())

        # For each measurement, get field keys
        fields_by_measurement = {}
        for measurement in measurements:
            fields_query = f'''
                import "influxdata/influxdb/schema"
                schema.measurementFieldKeys(
                    bucket: "{BUCKET}", 
                    measurement: "{measurement}"
                )
            '''
            fields = []
            try:
                fields_result = query_api.query(fields_query)
                for table in fields_result:
                    for record in table.records:
                        fields.append(record.get_value())
                fields_by_measurement[measurement] = fields
            except Exception:
                fields_by_measurement[measurement] = ["Error querying fields"]

        return jsonify({
            "measurements": measurements,
            "fields_by_measurement": fields_by_measurement
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/debug/data", methods=["GET"])
def debug_data():
    """Get sample data from all measurements"""
    try:
        # Get all measurements
        measurements_query = f'''
            import "influxdata/influxdb/schema"
            schema.measurements(bucket: "{BUCKET}")
        '''
        measurements = []
        measurements_result = query_api.query(measurements_query)
        for table in measurements_result:
            for record in table.records:
                measurements.append(record.get_value())

        # For each measurement, fetch sample data
        sample_data = {}
        for measurement in measurements:
            sample_query = f'''
                from(bucket: "{BUCKET}")
                    |> range(start: -1h)
                    |> filter(fn: (r) => r._measurement == "{measurement}")
                    |> limit(n: 5)
            '''
            try:
                result = query_api.query(sample_query)
                data = []
                for table in result:
                    for record in table.records:
                        data.append({
                            "time": record.get_time().isoformat(),
                            "measurement": record.get_measurement(),
                            "field": record.get_field(),
                            "value": record.get_value(),
                            "values": dict(record.values)
                        })
                sample_data[measurement] = data
            except Exception as e:
                sample_data[measurement] = f"Error: {str(e)}"

        return jsonify(sample_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------- Joystick Endpoint -----------------
@app.route("/api/joystick", methods=["GET"])
def get_joystick_data():
    """Fetch the latest joystick movements (material only)"""
    query = f'''
        from(bucket: "{BUCKET}")
            |> range(start: -1h)
            |> filter(fn: (r) => r.topic == "waste_sorting/joystick")
            |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> keep(columns: ["_time", "material"])
            |> sort(columns: ["_time"], desc: true)
            |> limit(n: 50)
    '''
    try:
        result = query_api.query(query)
        data = []
        for table in result:
            for record in table.records:
                row = {
                    "time": record.get_time().isoformat(),
                    "material": record.values.get("material")
                }
                data.append(row)
        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ----------------- Health Check -----------------
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})


# ----------------- Run App -----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
