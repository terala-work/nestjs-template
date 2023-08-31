import { DiagConsoleLogger, DiagLogLevel, diag, trace } from "@opentelemetry/api";

import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { HostMetrics } from "@opentelemetry/host-metrics";
import { AWSXRayIdGenerator } from "@opentelemetry/id-generator-aws-xray";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { AwsLambdaInstrumentation } from "@opentelemetry/instrumentation-aws-lambda";
import { AWSXRayPropagator } from "@opentelemetry/propagator-aws-xray";
import { Resource } from "@opentelemetry/resources";
import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

import dotenv from "dotenv";
dotenv.config();

const serviceName = "nestjs-template";
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const metricsExporterOptions = {
  // url: "grpc://localhost:14317/v1/metrics",
  url: "grpc://localhost:14317",
};

const _resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: `nestjs-template-metrics`,
  }),
);

const meterProvider = new MeterProvider({
  resource: _resource,
});

const _metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter(metricsExporterOptions),
  exportIntervalMillis: 1000,
});

meterProvider.addMetricReader(_metricReader);

//host metrics cpu, network and memory
const hostMetrics = new HostMetrics({
  meterProvider,
  name: `${serviceName}-host-metrics`,
  url: metricsExporterOptions.url,
});
hostMetrics.start();

const tracerProvider = new NodeTracerProvider({
  resource: Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: `nestjs-template-traces`,
    }),
  ),
  idGenerator: new AWSXRayIdGenerator(),
});

tracerProvider.addSpanProcessor(
  new BatchSpanProcessor(
    new OTLPTraceExporter({
      // url: process.env.OTEL_EXPORTER_ENDPOINT + "/v1/traces",
      url: "grpc://localhost:14317/v1/traces",
    }),
  ),
);
tracerProvider.register({
  propagator: new AWSXRayPropagator(),
});
tracerProvider.register();

registerInstrumentations({
  instrumentations: [
    new AwsLambdaInstrumentation(),
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-aws-lambda": {
        disableAwsContextPropagation: true,
      },
    }),
  ],
});

export default trace.getTracer(serviceName ?? "");
