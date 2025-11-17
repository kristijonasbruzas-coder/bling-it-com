import React, { useState } from "react";

// Mock data – in production this would come from your database / search API
const MOCK_BODIES = [
  {
    id: "gtr-r34",
    name: "Nissan Skyline GT-R R34",
    brand: "Nissan",
    era: "1990s",
    tags: ["drift", "jdm"],
  },
  {
    id: "911-gt3",
    name: "Porsche 911 GT3",
    brand: "Porsche",
    era: "2010s",
    tags: ["track", "euro"],
  },
  {
    id: "ae86",
    name: "Toyota AE86 Trueno",
    brand: "Toyota",
    era: "1980s",
    tags: ["drift", "classic"],
  },
];

const MOCK_WHEELS = [
  {
    id: "stock-12",
    name: "Stock R12 mm",
    size: 12,
    type: "stock",
  },
  {
    id: "stock-14",
    name: "Stock R14 mm",
    size: 14,
    type: "stock",
  },
  {
    id: "deepdish-12",
    name: "Deep Dish R12 mm",
    size: 12,
    type: "custom",
  },
];

function Tag({ label }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
      {label}
    </span>
  );
}

function SectionTitle({ step, title, subtitle }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-2">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Step {step}
        </div>
        <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        )}
      </div>
      <span className="mt-1 rounded-full bg-purple-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-purple-300">
        1/43 Scale · 65 mm
      </span>
    </div>
  );
}

const DropZone = ({
  label,
  description,
  onFileSelect,
  previewUrl,
}) => {
  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const imageFile = Array.from(files).find((f) => f.type.startsWith("image/"));
    onFileSelect(imageFile || files[0]);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <label
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-4 py-6 text-center text-xs text-slate-300 transition hover:border-purple-400/60 hover:bg-slate-900"
    >
      <div className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-300">
        Drag & Drop or Click
      </div>
      <div className="text-sm font-medium text-slate-50">{label}</div>
      <p className="max-w-xs text-[11px] text-slate-400">{description}</p>

      {previewUrl && (
        <div className="mt-3 w-full max-w-xs overflow-hidden rounded-xl border border-slate-700 bg-black/40">
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="h-32 w-full object-cover"
          />
        </div>
      )}

      <input
        type="file"
        className="hidden"
        accept="image/*,.stl,.obj"
        onChange={handleChange}
      />
    </label>
  );
};

export default function BlingItConfigurator() {
  const [bodyQuery, setBodyQuery] = useState("");
  const [selectedBodyId, setSelectedBodyId] = useState(null);
  const [wheelMode, setWheelMode] = useState("stock");
  const [selectedWheelId, setSelectedWheelId] = useState("stock-12");
  const [customWheelSize, setCustomWheelSize] = useState(12);
  const [chassisOption, setChassisOption] = useState("printed-shell");

  const [bodyUploadPreview, setBodyUploadPreview] = useState(null);
  const [wheelUploadPreview, setWheelUploadPreview] = useState(null);

  const [detectedBodyCandidates, setDetectedBodyCandidates] = useState([]);
  const [detectedWheelInfo, setDetectedWheelInfo] = useState(null);

  const [isGeneratingShell, setIsGeneratingShell] = useState(false);
  const [isGeneratingWheels, setIsGeneratingWheels] = useState(false);
  const [shellGenerated, setShellGenerated] = useState(false);
  const [wheelsGenerated, setWheelsGenerated] = useState(false);

  const filteredBodies = MOCK_BODIES.filter((body) => {
    if (!bodyQuery) return true;
    const q = bodyQuery.toLowerCase();
    return (
      body.name.toLowerCase().includes(q) ||
      body.brand.toLowerCase().includes(q) ||
      body.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const selectedBody = MOCK_BODIES.find((b) => b.id === selectedBodyId) || null;
  const selectedWheel = MOCK_WHEELS.find((w) => w.id === selectedWheelId) || null;

  const assemblyReady = shellGenerated && (wheelMode === "stock" || wheelsGenerated);

  const handleDetectCarFromImage = () => {
    if (!bodyUploadPreview) return;
    // In production, send uploaded file to backend AI. Here we fake top-3 matches.
    const fake = MOCK_BODIES.map((b, index) => ({
      id: b.id,
      name: b.name,
      confidence: 0.9 - index * 0.15,
    }));
    setDetectedBodyCandidates(fake);
    if (fake[0]) {
      setSelectedBodyId(fake[0].id);
    }
  };

  const handleDetectWheelFromImage = () => {
    if (!wheelUploadPreview) return;
    // In production, detect real diameter/offset. Here we fake a result.
    const detectedSize = 12;
    setDetectedWheelInfo({ size: detectedSize, style: "multi-spoke" });
    setCustomWheelSize(detectedSize);
  };

  const handleGenerateShell = () => {
    if (!selectedBody && !bodyUploadPreview) return;
    setIsGeneratingShell(true);
    setShellGenerated(false);
    setTimeout(() => {
      setIsGeneratingShell(false);
      setShellGenerated(true);
    }, 800);
  };

  const handleGenerateWheels = () => {
    if (wheelMode === "custom" && !wheelUploadPreview) return;
    setIsGeneratingWheels(true);
    setWheelsGenerated(false);
    setTimeout(() => {
      setIsGeneratingWheels(false);
      setWheelsGenerated(true);
    }, 800);
  };

  const orderPayload = {
    body: selectedBody
      ? {
          id: selectedBody.id,
          name: selectedBody.name,
        }
      : null,
    wheelbase_mm: 65,
    wheels:
      wheelMode === "stock"
        ? selectedWheel
        : {
            mode: "custom",
            diameter_mm: customWheelSize,
            detected: detectedWheelInfo,
          },
    chassis_option: chassisOption,
    generation: {
      shellGenerated,
      wheelsGenerated,
      assemblyReady,
    },
    deliverables: {
      stl_file: true,
      printable_scale: "1/43",
      ensure_wheelbase_lock: true,
      separate_shell_and_wheels: true,
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top nav */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-500 via-cyan-400 to-sky-500 text-xs font-black tracking-tight text-slate-950 shadow-lg">
              bl
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                bling.it
              </div>
              <div className="text-[11px] text-slate-500">
                1/43 RC Shell Studio · Jiabaile 65 mm
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="hidden md:inline">
              Primary: Shell · Secondary: Wheels · Optional: Chassis
            </span>
            <span className="rounded-full border border-slate-700 px-3 py-1 text-[10px] uppercase tracking-wide text-purple-300">
              Prototype UI
            </span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row">
        {/* Left column: configuration steps */}
        <div className="flex flex-1 flex-col gap-4">
          {/* STEP 1: Body */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
            <SectionTitle
              step={1}
              title="Select or upload your body shell"
              subtitle="Search our library or upload photos/3D files of your own 1:1 car. The generator will detect the model and scale it to a 65 mm wheelbase."
            />

            <div className="grid gap-4 md:grid-cols-2">
              {/* Search & results */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={bodyQuery}
                    onChange={(e) => setBodyQuery(e.target.value)}
                    placeholder="Search by brand, model, style (e.g. '911', 'drift', 'JDM')"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-purple-400 focus:outline-none"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Body search
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {filteredBodies.length} result
                      {filteredBodies.length === 1 ? "" : "s"} matching query
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {filteredBodies.map((body) => (
                      <button
                        key={body.id}
                        type="button"
                        onClick={() => setSelectedBodyId(body.id)}
                        className={`flex items-start justify-between gap-2 rounded-2xl border px-3 py-2 text-left text-xs transition ${
                          selectedBodyId === body.id
                            ? "border-purple-400/70 bg-purple-400/10 shadow-[0_0_0_1px_rgba(168,85,247,0.4)]"
                            : "border-slate-700 bg-slate-950/40 hover:border-purple-400/60 hover:bg-slate-900"
                        }`}
                      >
                        <div>
                          <div className="text-[13px] font-medium text-slate-50">
                            {body.name}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-400">
                            {body.brand} · {body.era} · 1/43 template
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {body.tags.map((t) => (
                              <Tag key={t} label={t} />
                            ))}
                          </div>
                        </div>
                        <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-purple-300">
                          Select
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload zone + detection results */}
              <div className="space-y-3">
                <DropZone
                  label="Upload your own car"
                  description="Drop reference photos, blueprints or existing 3D meshes (.STL / .OBJ). Our backend will detect the car model, align it to Jiabaile chassis and generate a printable shell."
                  previewUrl={bodyUploadPreview}
                  onFileSelect={(file) => {
                    if (file.type.startsWith("image/")) {
                      const url = URL.createObjectURL(file);
                      setBodyUploadPreview(url);
                    } else {
                      setBodyUploadPreview(null);
                    }
                    // TODO: send file to backend for processing
                  }}
                />
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={handleDetectCarFromImage}
                    disabled={!bodyUploadPreview}
                    className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide transition ${
                      bodyUploadPreview
                        ? "border-purple-400 text-purple-300 hover:bg-purple-500/10"
                        : "cursor-not-allowed border-slate-700 text-slate-600"
                    }`}
                  >
                    Detect car model from image
                  </button>
                  <span className="text-[10px] text-slate-500">
                    Uses AI to recognize make/model and best base template.
                  </span>
                </div>

                {detectedBodyCandidates.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-2 text-[11px]">
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Detected matches
                    </div>
                    <div className="space-y-1.5">
                      {detectedBodyCandidates.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedBodyId(c.id)}
                          className={`flex w-full items-center justify-between rounded-xl px-2 py-1 text-left transition ${
                            selectedBodyId === c.id
                              ? "bg-purple-500/20 text-slate-50"
                              : "hover:bg-slate-800/80 text-slate-300"
                          }`}
                        >
                          <span>{c.name}</span>
                          <span className="text-[10px] text-slate-400">
                            {(c.confidence * 100).toFixed(0)}%
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-slate-400">
                  The generator normalizes the body to a fixed <span className="font-semibold text-purple-300">65 mm wheelbase</span> so it fits Jiabaile 1/43 chassis without manual scaling.
                </p>
              </div>
            </div>
          </section>

          {/* STEP 2: Wheels */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
            <SectionTitle
              step={2}
              title="Choose wheels (optional)"
              subtitle="Shell is primary. You can keep stock Jiabaile wheels or upload custom wheel designs for a full character build."
            />
            <div className="grid gap-4 md:grid-cols-[1.2fr_minmax(0,1fr)]">
              <div className="space-y-3">
                <div className="inline-flex gap-1 rounded-full bg-slate-950/70 p-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setWheelMode("stock")}
                    className={`flex-1 rounded-full px-3 py-1 transition ${
                      wheelMode === "stock"
                        ? "bg-purple-500 text-slate-950 shadow"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    Stock Jiabaile wheels
                  </button>
                  <button
                    type="button"
                    onClick={() => setWheelMode("custom")}
                    className={`flex-1 rounded-full px-3 py-1 transition ${
                      wheelMode === "custom"
                        ? "bg-purple-500 text-slate-950 shadow"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    Custom wheel design
                  </button>
                </div>

                {wheelMode === "stock" ? (
                  <div className="space-y-2">
                    <div className="text-[11px] text-slate-400">
                      Select the Jiabaile-compatible wheel size you want us to design around.
                    </div>
                    <div className="flex gap-2">
                      {MOCK_WHEELS.filter((w) => w.type === "stock").map((wheel) => (
                        <button
                          key={wheel.id}
                          type="button"
                          onClick={() => setSelectedWheelId(wheel.id)}
                          className={`flex-1 rounded-2xl border px-3 py-2 text-left text-xs transition ${
                            selectedWheelId === wheel.id
                              ? "border-purple-400/70 bg-purple-400/10"
                              : "border-slate-700 bg-slate-950/40 hover:border-purple-400/60 hover:bg-slate-900"
                          }`}
                        >
                          <div className="text-[13px] font-medium text-slate-50">
                            {wheel.name}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-400">
                            Perfect fit for Jiabaile drift chassis
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <DropZone
                      label="Upload custom wheel design"
                      description="Drop side/face photos of wheels or existing 3D files. We'll detect diameter, offset and style, then generate a Jiabaile-compatible insert."
                      previewUrl={wheelUploadPreview}
                      onFileSelect={(file) => {
                        if (file.type.startsWith("image/")) {
                          const url = URL.createObjectURL(file);
                          setWheelUploadPreview(url);
                        } else {
                          setWheelUploadPreview(null);
                        }
                        // TODO: send wheel file to backend for processing
                      }}
                    />
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                      <button
                        type="button"
                        onClick={handleDetectWheelFromImage}
                        disabled={!wheelUploadPreview}
                        className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide transition ${
                          wheelUploadPreview
                            ? "border-purple-400 text-purple-300 hover:bg-purple-500/10"
                            : "cursor-not-allowed border-slate-700 text-slate-600"
                        }`}
                      >
                        Detect wheel style & size
                      </button>
                      <span className="text-[10px] text-slate-500">
                        AI reads diameter/offset and builds a Jiabaile insert.
                      </span>
                    </div>

                    {detectedWheelInfo && (
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-2 text-[11px] text-slate-300">
                        <div className="flex items-center justify-between">
                          <span>Detected diameter</span>
                          <span className="font-medium text-purple-300">
                            {detectedWheelInfo.size} mm
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Style</span>
                          <span>{detectedWheelInfo.style}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Target wheel diameter</span>
                        <span className="font-medium text-purple-300">
                          {customWheelSize} mm
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={18}
                        step={1}
                        value={customWheelSize}
                        onChange={(e) => setCustomWheelSize(parseInt(e.target.value, 10))}
                        className="w-full accent-purple-500"
                      />
                      <p className="text-[10px] text-slate-500">
                        We'll scale your custom wheel model to this diameter while keeping Jiabaile mounting points.
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Custom wheels are treated as a separate add-on in your order. We'll keep the chassis mounting standard so you can mix and match future shells.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-300">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Fitment rules
                </div>
                <ul className="mt-1 space-y-1.5 list-disc pl-4">
                  <li>Wheelbase is locked at 65 mm to match Jiabaile RC chassis.</li>
                  <li>Clearance & steering angle will be validated against your selected body.</li>
                  <li>Custom wheels will be scaled to your chosen diameter (10–18 mm or detected from reference).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* STEP 3: Output & chassis option */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
            <SectionTitle
              step={3}
              title="Output & chassis options"
              subtitle="Decide how you want to receive your build: digital-only, printed shell, or a complete Jiabaile-based RC car."
            />
            <div className="grid gap-4 md:grid-cols-3">
              <button
                type="button"
                onClick={() => setChassisOption("stl-only")}
                className={`flex flex-col justify-between rounded-2xl border p-3 text-left text-xs transition ${
                  chassisOption === "stl-only"
                    ? "border-purple-400/70 bg-purple-400/10"
                    : "border-slate-700 bg-slate-950/40 hover:border-purple-400/60 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="text-[13px] font-semibold text-slate-50">
                    Digital STL only
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Separate shell and wheel 3D files (if selected) for your own printer. 65 mm wheelbase baked in.
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-purple-300">
                  For makers with printers
                </div>
              </button>

              <button
                type="button"
                onClick={() => setChassisOption("printed-shell")}
                className={`flex flex-col justify-between rounded-2xl border p-3 text-left text-xs transition ${
                  chassisOption === "printed-shell"
                    ? "border-purple-400/70 bg-purple-400/10"
                    : "border-slate-700 bg-slate-950/40 hover:border-purple-400/60 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="text-[13px] font-semibold text-slate-50">
                    Printed shell only
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    We print and ship the shell sized for Jiabaile chassis. Wheels and chassis are your choice.
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-purple-300">
                  Primary, most popular option
                </div>
              </button>

              <button
                type="button"
                onClick={() => setChassisOption("printed-with-chassis")}
                className={`flex flex-col justify-between rounded-2xl border p-3 text-left text-xs transition ${
                  chassisOption === "printed-with-chassis"
                    ? "border-purple-400/70 bg-purple-400/10"
                    : "border-slate-700 bg-slate-950/40 hover:border-purple-400/60 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="text-[13px] font-semibold text-slate-50">
                    Printed shell + RC chassis
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Complete Jiabaile-based 1/43 RC car with your shell pre-mounted and tested.
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-purple-300">
                  Full ready-to-run option
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Right column: preview & order summary */}
        <aside className="w-full max-w-md space-y-4 md:sticky md:top-4 md:h-[calc(100vh-6rem)] md:overflow-y-auto">
          {/* 3D Preview placeholder */}
          <section className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 shadow-[0_0_40px_rgba(168,85,247,0.35)]">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-300">
                  3D preview
                </div>
                <div className="text-[11px] text-slate-400">
                  Shell & wheels generated separately, assembled on 65 mm chassis
                </div>
              </div>
              <div className="rounded-full bg-black/40 px-3 py-1 text-[10px] text-slate-300">
                View: Shell · Wheels · Assembly
              </div>
            </div>

            <div className="mb-2 grid grid-cols-3 gap-1 text-[10px] text-slate-300">
              <div className="rounded-xl bg-black/40 px-2 py-1">
                <div className="text-[9px] uppercase tracking-wide text-slate-500">
                  Shell
                </div>
                <div className={shellGenerated ? "text-purple-300" : "text-slate-500"}>
                  {shellGenerated ? "Generated" : "Not generated"}
                </div>
              </div>
              <div className="rounded-xl bg-black/40 px-2 py-1">
                <div className="text-[9px] uppercase tracking-wide text-slate-500">
                  Wheels
                </div>
                <div className={
                  wheelMode === "stock"
                    ? "text-purple-300"
                    : wheelsGenerated
                    ? "text-purple-300"
                    : "text-slate-500"
                }>
                  {wheelMode === "stock"
                    ? selectedWheel?.name || "Stock"
                    : wheelsGenerated
                    ? `${customWheelSize} mm custom`
                    : "Not generated"}
                </div>
              </div>
              <div className="rounded-xl bg-black/40 px-2 py-1">
                <div className="text-[9px] uppercase tracking-wide text-slate-500">
                  Assembly
                </div>
                <div className={assemblyReady ? "text-purple-300" : "text-slate-500"}>
                  {assemblyReady ? "Ready" : "Waiting"}
                </div>
              </div>
            </div>

            <div className="relative mb-3 flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-purple-500/40 bg-slate-950">
              {/* Stylized fake 3D assembly: shell + wheels */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(168,85,247,0.35),transparent_55%),radial-gradient(circle_at_10%_120%,rgba(59,130,246,0.25),transparent_55%)] opacity-70" />
              <div className="relative flex flex-col items-center gap-4">
                {/* Shell silhouette */}
                <div
                  className={`h-16 w-40 rounded-[40px] border bg-slate-950/70 transition ${
                    shellGenerated
                      ? "border-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.7)]"
                      : "border-slate-700"
                  }`}
                />
                {/* Wheels silhouette – scale width slightly with customWheelSize */}
                <div className="flex w-40 items-center justify-between">
                  <div
                    className={`h-7 rounded-full border bg-slate-950 transition ${
                      wheelMode === "stock" || wheelsGenerated
                        ? "border-purple-300"
                        : "border-slate-700"
                    }`}
                    style={{ width: "1.75rem" }}
                  />
                  <div
                    className={`h-7 rounded-full border bg-slate-950 transition ${
                      wheelMode === "stock" || wheelsGenerated
                        ? "border-purple-300"
                        : "border-slate-700"
                    }`}
                    style={{ width: "1.75rem" }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-slate-300">
                  Wheelbase locked at <span className="font-semibold text-purple-300">65 mm</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[11px]">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleGenerateShell}
                  disabled={isGeneratingShell || (!selectedBody && !bodyUploadPreview)}
                  className={`flex-1 rounded-2xl px-3 py-1.5 text-xs font-semibold transition ${
                    isGeneratingShell || (!selectedBody && !bodyUploadPreview)
                      ? "cursor-not-allowed bg-slate-800 text-slate-500"
                      : "bg-purple-500 text-slate-950 hover:bg-purple-400"
                  }`}
                >
                  {isGeneratingShell ? "Generating shell…" : "Generate shell model"}
                </button>
                <button
                  type="button"
                  onClick={handleGenerateWheels}
                  disabled={
                    isGeneratingWheels ||
                    (wheelMode === "custom" && !wheelUploadPreview)
                  }
                  className={`flex-1 rounded-2xl px-3 py-1.5 text-xs font-semibold transition ${
                    isGeneratingWheels ||
                    (wheelMode === "custom" && !wheelUploadPreview)
                      ? "cursor-not-allowed bg-slate-800 text-slate-500"
                      : "bg-purple-500 text-slate-950 hover:bg-purple-400"
                  }`}
                >
                  {isGeneratingWheels ? "Generating wheels…" : "Generate wheel model"}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                In production, each button would call separate backend pipelines for shell and wheels, then the viewer assembles them virtually on top of the Jiabaile chassis.
              </p>
            </div>
          </section>

          {/* Order summary */}
          <section className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Order summary
                </div>
                <div className="text-[11px] text-slate-500">
                  This is what will be sent to your backend when the client confirms.
                </div>
              </div>
            </div>

            <div className="space-y-1 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Body shell</span>
                <span className="font-medium text-slate-100">
                  {selectedBody ? selectedBody.name : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Wheelbase</span>
                <span className="font-medium text-purple-300">65 mm (fixed)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Wheels</span>
                <span className="font-medium text-slate-100">
                  {wheelMode === "stock"
                    ? selectedWheel?.name || "Stock Jiabaile"
                    : `${customWheelSize} mm custom`}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Output</span>
                <span className="font-medium text-slate-100">
                  {chassisOption === "stl-only" && "Digital STL only"}
                  {chassisOption === "printed-shell" && "Printed shell only (no chassis)"}
                  {chassisOption === "printed-with-chassis" && "Printed shell + Jiabaile RC chassis"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="mb-1 text-[11px] font-semibold text-slate-200">
                Payload preview (for you as the store owner)
              </div>
              <pre className="max-h-40 overflow-auto rounded-xl bg-slate-950/80 p-2 text-[10px] leading-relaxed text-purple-200">
{JSON.stringify(orderPayload, null, 2)}
              </pre>
            </div>

            <button
              type="button"
              disabled={!assemblyReady}
              className={`flex w-full items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                assemblyReady
                  ? "bg-slate-50 text-slate-950 hover:bg-slate-200"
                  : "cursor-not-allowed bg-slate-800 text-slate-500"
              }`}
            >
              {assemblyReady
                ? "Confirm order & send files to Bling.it"
                : "Generate shell & wheels to unlock ordering"}
            </button>

            <p className="text-[10px] text-slate-500">
              On confirmation, your backend should receive: the client's contact details, selected car model, wheel configuration (including diameter if custom), chassis option, and separate 3D files for shell and wheels (STL/OBJ) ready for printing or archive.
            </p>
          </section>

          {/* Implementation notes for you */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Implementation notes
            </div>
            <ul className="mt-1 space-y-1.5 list-disc pl-4">
              <li>
                Replace mock data with real search endpoints for body shells and wheel libraries.
              </li>
              <li>
                Hook up the drag & drop zones to your image/3D-upload pipeline and AI model that detects car/wheel shapes and generates meshes.
              </li>
              <li>
                Use a real 3D viewer (e.g. three.js) to load the generated shell and wheel meshes separately, then assemble them virtually on a 65 mm Jiabaile chassis rig.
              </li>
              <li>
                Connect the "Confirm order" button to your checkout + admin notification flow (email, dashboard, or manufacturing queue).
              </li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}
