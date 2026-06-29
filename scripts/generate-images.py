#!/usr/bin/env python3
"""Generate AI images for Pintarweb client demos via Cloudflare Workers AI."""

import json
import base64
import subprocess
import sys
import os
import time

ACCOUNT_ID = "6608a11fd74a74b741d55d0c10f7643e"
OAUTH_TOKEN = "cfoat_T7jkHajoNpkTJcEelErKSRtrMTuLpq-fPmcPHVRXvYY.ELbs_NNC-DgHSBDzRTnxPAEGP5lhTBu9kSoOGrhClg4"
MODEL = "@cf/black-forest-labs/flux-1-schnell"
BASE_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "packages/site-generator/design-system/references/image-collections",
)

IMAGES = [
    # Aircond - hero + services + gallery
    (
        "aircond-service/hero.webp",
        "Photorealistic: Malaysian technician in blue uniform servicing a wall-mounted air conditioning unit with wrench and tools, indoor residential setting, warm natural lighting, professional photography, shallow depth of field, no text no watermark",
        1024,
        768,
    ),
    (
        "aircond-service/service-1.webp",
        "Photorealistic: Close-up of air conditioning chemical wash cleaning, spray bottle and foam on indoor unit, technician hands visible, warm lighting, professional photography, no text no watermark",
        640,
        480,
    ),
    (
        "aircond-service/service-2.webp",
        "Photorealistic: Installing new white wall-mounted air conditioning unit, technician drilling mounting bracket on wall, tools and ladder visible, residential setting, warm lighting, no text no watermark",
        640,
        480,
    ),
    (
        "aircond-service/service-3.webp",
        "Photorealistic: Open air conditioning outdoor compressor unit being repaired, technician hands with multimeter testing electrical connections, outdoor setting, natural lighting, no text no watermark",
        640,
        480,
    ),
    (
        "aircond-service/gallery-1.webp",
        "Photorealistic: Before and after of clean air conditioning indoor unit on living room wall, modern Malaysian home interior, warm lighting, no text no watermark",
        640,
        480,
    ),
    (
        "aircond-service/gallery-2.webp",
        "Photorealistic: Stack of air conditioning units in a shop ready for installation, organized and clean, warehouse setting, natural lighting, no text no watermark",
        640,
        480,
    ),
    (
        "aircond-service/gallery-3.webp",
        "Photorealistic: Technician van parked in front of Malaysian terrace house, blue work van with tools, residential street, daytime, no text no watermark",
        640,
        480,
    ),
    # Plumbing - hero + services + gallery
    (
        "plumbing/hero.webp",
        "Photorealistic: Malaysian plumber in work clothes fixing copper pipes under a kitchen sink with adjustable wrench, PVC pipes and tools visible, residential setting, warm natural lighting, professional photography, shallow depth of field, no text no watermark",
        1024,
        768,
    ),
    (
        "plumbing/service-1.webp",
        "Photorealistic: Close-up of plumber hands connecting new PVC pipe fittings with pipe cement, tools and pipe cutter on floor, residential bathroom, warm lighting, no text no watermark",
        640,
        480,
    ),
    (
        "plumbing/service-2.webp",
        "Photorealistic: Drain cleaning with plumber snake auger cable going into floor drain, technician hands operating drain machine, residential setting, warm lighting, no text no watermark",
        640,
        480,
    ),
    (
        "plumbing/service-3.webp",
        "Photorealistic: Water heater installation on bathroom wall, technician connecting copper pipes to electric water heater unit, tools visible, residential setting, warm lighting, no text no watermark",
        640,
        480,
    ),
    (
        "plumbing/gallery-1.webp",
        "Photorealistic: Newly installed bathroom piping system, clean copper and PVC pipes organized along wall, professional plumbing work, residential bathroom, warm lighting, no text no watermark",
        640,
        480,
    ),
    (
        "plumbing/gallery-2.webp",
        "Photorealistic: Plumber toolbox with wrenches pipe cutters and fittings organized neatly, top view, warm lighting, professional photography, no text no watermark",
        640,
        480,
    ),
    (
        "plumbing/gallery-3.webp",
        "Photorealistic: Water pressure gauge and new pipe installation showing clean professional plumbing work, close-up, warm lighting, no text no watermark",
        640,
        480,
    ),
    # Electrical - hero + services + gallery
    (
        "electrical/hero.webp",
        "Photorealistic: Malaysian electrician in safety gear working on an electrical distribution panel box with colorful wires, using multimeter, professional tools, indoor commercial setting, warm natural lighting, professional photography, shallow depth of field, no text no watermark",
        1024,
        768,
    ),
    (
        "electrical/service-1.webp",
        "Photorealistic: Close-up of electrician hands pulling new electrical cables through wall conduit, wire stripper and cables visible, residential wiring installation, warm lighting, no text no watermark",
        640,
        480,
    ),
    (
        "electrical/service-2.webp",
        "Photorealistic: Electrician replacing wall power socket outlet with screwdriver, new white socket faceplate, close-up of hands working, residential setting, warm lighting, no text no watermark",
        640,
        480,
    ),
    (
        "electrical/service-3.webp",
        "Photorealistic: Ceiling fan installation, technician on ladder mounting fan to ceiling bracket, white ceiling fan, residential living room, warm lighting, no text no watermark",
        640,
        480,
    ),
    (
        "electrical/gallery-1.webp",
        "Photorealistic: Neatly organized electrical panel with labeled circuit breakers and color-coded wires, professional electrical installation, close-up, warm lighting, no text no watermark",
        640,
        480,
    ),
    (
        "electrical/gallery-2.webp",
        "Photorealistic: Electrician toolbox with wire strippers pliers screwdrivers and electrical tape organized, top view, warm lighting, professional photography, no text no watermark",
        640,
        480,
    ),
    (
        "electrical/gallery-3.webp",
        "Photorealistic: Modern LED ceiling lights and ceiling fan installed in Malaysian living room, clean professional electrical work, warm ambient lighting, no text no watermark",
        640,
        480,
    ),
]


def generate_image(prompt, width, height, output_path):
    """Call Cloudflare Workers AI to generate an image."""
    cmd = [
        "curl",
        "-s",
        f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/{MODEL}",
        "-H",
        f"Authorization: Bearer {OAUTH_TOKEN}",
        "-H",
        "Content-Type: application/json",
        "-d",
        json.dumps({"prompt": prompt, "width": width, "height": height}),
    ]

    result = subprocess.run(cmd, capture_output=True)
    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError:
        print(f"  ERROR: Invalid JSON response for {output_path}")
        return False

    if not data.get("success"):
        errors = data.get("errors", [])
        print(f"  ERROR: {errors}")
        return False

    image_b64 = data.get("result", {}).get("image")
    if not image_b64:
        print(f"  ERROR: No image in response for {output_path}")
        return False

    image_data = base64.b64decode(image_b64)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(image_data)

    size_kb = len(image_data) // 1024
    print(f"  OK: {output_path} ({size_kb}KB)")
    return True


def main():
    total = len(IMAGES)
    success = 0
    failed = 0

    for i, (rel_path, prompt, width, height) in enumerate(IMAGES, 1):
        output_path = os.path.join(BASE_DIR, rel_path)
        print(f"[{i}/{total}] Generating {rel_path}...")

        if generate_image(prompt, width, height, output_path):
            success += 1
        else:
            failed += 1
            # Retry once
            print(f"  Retrying...")
            time.sleep(2)
            if generate_image(prompt, width, height, output_path):
                success += 1
                failed -= 1

        time.sleep(1)  # Rate limit courtesy

    print(f"\nDone: {success} success, {failed} failed, out of {total} total")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
