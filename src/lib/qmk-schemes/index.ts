/* biome-ignore-all */

export type TextIdentifier = string;
export type Keyboard = string;
export type McuPin = "NO_PIN" | string | number | null;
export type McuPinArray = McuPin[];
export type Bit = number;
export type UnsignedInt_8 = number;
export type UnsignedInt = number;
export type Filename = string;
export type FeaturesConfig = BooleanArray & {
  [k: string]: unknown;
};
/**
 * @minItems 1
 */
export type KeycodeDeclArray = [KeycodeDecl, ...KeycodeDecl[]];
export type Keycode = string;
export type KeycodeShort = string;
export type LayoutMacro =
  | (
      | "LAYOUT"
      | "LAYOUT_1x2uC"
      | "LAYOUT_1x2uL"
      | "LAYOUT_1x2uR"
      | "LAYOUT_2x2uC"
      | "LAYOUT_2x3uC"
      | "LAYOUT_625uC"
      | "LAYOUT_ortho_3x12_1x2uC"
      | "LAYOUT_ortho_4x12_1x2uC"
      | "LAYOUT_ortho_4x12_1x2uL"
      | "LAYOUT_ortho_4x12_1x2uR"
      | "LAYOUT_ortho_5x12_1x2uC"
      | "LAYOUT_ortho_5x12_2x2uC"
      | "LAYOUT_ortho_5x14_1x2uC"
      | "LAYOUT_ortho_5x14_1x2uL"
      | "LAYOUT_ortho_5x14_1x2uR"
      | "LAYOUT_planck_1x2uC"
      | "LAYOUT_planck_1x2uL"
      | "LAYOUT_planck_1x2uR"
      | "LAYOUT_preonic_1x2uC"
      | "LAYOUT_preonic_1x2uL"
      | "LAYOUT_preonic_1x2uR"
    )
  | string;
export type SignedDecimal = number;
export type UnsignedDecimal = number;
export type KeyUnit = number;
export type BcdVersion = string;
export type HexNumber_4D = string;
export type HexNumber_2D = string;

export interface QMKKeyboard {
  keyboard_name?: TextIdentifier;
  keyboard_folder?: Keyboard;
  maintainer?: TextIdentifier;
  manufacturer?: TextIdentifier;
  url?: string;
  development_board?:
    | "promicro"
    | "elite_c"
    | "elite_pi"
    | "proton_c"
    | "kb2040"
    | "promicro_rp2040"
    | "blok"
    | "michi"
    | "bit_c_pro"
    | "stemcell"
    | "bluepill"
    | "blackpill_f401"
    | "blackpill_f411"
    | "bonsai_c4"
    | "helios"
    | "liatris"
    | "imera"
    | "svlinky";
  pin_compatible?: "promicro" | "elite_c";
  processor?:
    | "cortex-m0"
    | "cortex-m0plus"
    | "cortex-m3"
    | "cortex-m4"
    | "cortex-m7"
    | "cortex-m23"
    | "cortex-m33"
    | "cortex-m35p"
    | "cortex-m55"
    | "cortex-m85"
    | "MKL26Z64"
    | "MK20DX128"
    | "MK20DX256"
    | "MK64FX512"
    | "MK66FX1M0"
    | "RP2040"
    | "STM32F042"
    | "STM32F072"
    | "STM32F103"
    | "STM32F303"
    | "STM32F401"
    | "STM32F405"
    | "STM32F407"
    | "STM32F411"
    | "STM32F446"
    | "STM32G0B1"
    | "STM32G431"
    | "STM32G474"
    | "STM32H723"
    | "STM32H733"
    | "STM32L412"
    | "STM32L422"
    | "STM32L432"
    | "STM32L433"
    | "STM32L442"
    | "STM32L443"
    | "GD32VF103"
    | "WB32F3G71"
    | "WB32FQ95"
    | "AT32F415"
    | "atmega16u2"
    | "atmega32u2"
    | "atmega16u4"
    | "atmega32u4"
    | "at90usb162"
    | "at90usb646"
    | "at90usb647"
    | "at90usb1286"
    | "at90usb1287"
    | "atmega32a"
    | "atmega328p"
    | "atmega328"
    | "attiny85"
    | "unknown";
  apa102?: {
    data_pin?: McuPin;
    clock_pin?: McuPin;
    default_brightness?: number;
  };
  audio?: {
    default?: {
      on?: boolean;
      clicky?: boolean;
    };
    driver?: "dac_additive" | "dac_basic" | "pwm_software" | "pwm_hardware";
    macro_beep?: boolean;
    pins?: McuPinArray;
    power_control?: {
      on_state?: Bit;
      pin?: McuPin;
    };
    voices?: boolean;
  };
  backlight?: {
    driver?: "custom" | "pwm" | "software" | "timer";
    default?: {
      on?: boolean;
      breathing?: boolean;
      brightness?: UnsignedInt_8;
    };
    breathing?: boolean;
    breathing_period?: UnsignedInt_8;
    levels?: number;
    max_brightness?: UnsignedInt_8;
    pin?: McuPin;
    pins?: McuPinArray;
    on_state?: Bit;
    as_caps_lock?: boolean;
  };
  battery?: {
    driver?: "adc" | "custom" | "vendor";
    adc?: {
      pin?: McuPin;
      reference_voltage?: number;
      divider_r1?: number;
      divider_r2?: number;
      resolution?: number;
    };
    sample_interval?: number;
  };
  bluetooth?: {
    driver?: "bluefruit_le" | "custom" | "rn42";
  };
  bootmagic?: {
    enabled?: boolean;
    /**
     * @minItems 2
     * @maxItems 2
     */
    matrix?: [number, number];
  };
  board?: string;
  bootloader?:
    | "apm32-dfu"
    | "at32-dfu"
    | "atmel-dfu"
    | "bootloadhid"
    | "caterina"
    | "custom"
    | "gd32v-dfu"
    | "halfkay"
    | "kiibohd"
    | "lufa-dfu"
    | "lufa-ms"
    | "md-boot"
    | "qmk-dfu"
    | "qmk-hid"
    | "rp2040"
    | "stm32-dfu"
    | "stm32duino"
    | "tinyuf2"
    | "uf2boot"
    | "unknown"
    | "usbasploader"
    | "wb32-dfu";
  /**
   * Instructions for putting the keyboard into a mode that allows for firmware flashing.
   */
  bootloader_instructions?: string;
  build?: {
    debounce_type?:
      | "asym_eager_defer_pk"
      | "custom"
      | "sym_defer_g"
      | "sym_defer_pk"
      | "sym_defer_pr"
      | "sym_eager_pk"
      | "sym_eager_pr";
    firmware_format?: "bin" | "hex" | "uf2";
    lto?: boolean;
  };
  diode_direction?: "COL2ROW" | "ROW2COL";
  debounce?: UnsignedInt;
  caps_word?: {
    enabled?: boolean;
    both_shifts_turns_on?: boolean;
    double_tap_shift_turns_on?: boolean;
    idle_timeout?: UnsignedInt;
    invert_on_shift?: boolean;
  };
  combo?: {
    count?: UnsignedInt;
    term?: UnsignedInt;
    [k: string]: unknown;
  };
  community_layouts?: Filename[];
  dip_switch?: DipSwitchConfig & {
    enabled?: boolean;
    /**
     * @minItems 1
     */
    matrix_grid?: [[number, number], ...[number, number][]];
    [k: string]: unknown;
  };
  eeprom?: {
    driver?: string;
    wear_leveling?: {
      driver?: "none" | "custom" | "embedded_flash" | "legacy" | "rp2040_flash" | "spi_flash";
      backing_size?: UnsignedInt;
      logical_size?: UnsignedInt;
    };
    [k: string]: unknown;
  };
  encoder?: EncoderConfig & {
    enabled?: boolean;
    [k: string]: unknown;
  };
  features?: FeaturesConfig;
  indicators?: {
    caps_lock?: McuPin;
    num_lock?: McuPin;
    scroll_lock?: McuPin;
    compose?: McuPin;
    kana?: McuPin;
    on_state?: Bit;
    [k: string]: unknown;
  };
  joystick?: {
    enabled?: boolean;
    driver?: string;
    button_count?: UnsignedInt;
    axis_resolution?: UnsignedInt;
    axes?: {
      [k: string]:
        | {
            input_pin?: McuPin;
            low?: UnsignedInt;
            rest?: UnsignedInt;
            high?: UnsignedInt;
            [k: string]: unknown;
          }
        | "virtual";
    };
    [k: string]: unknown;
  };
  keycodes?: KeycodeDeclArray;
  layer_lock?: {
    timeout?: UnsignedInt;
    [k: string]: unknown;
  };
  layout_aliases?: {
    [k: string]: LayoutMacro;
  };
  layouts?: {
    [k: string]: {
      filename?: string;
      c_macro?: boolean;
      json_layout?: boolean;
      layout?: {
        encoder?: UnsignedInt;
        label?: string;
        /**
         * @minItems 2
         * @maxItems 2
         */
        matrix?: [number, number];
        r?: SignedDecimal;
        rx?: UnsignedDecimal;
        ry?: UnsignedDecimal;
        h?: KeyUnit;
        w?: KeyUnit;
        x: KeyUnit;
        y: KeyUnit;
        hand?: "L" | "R" | "*";
      }[];
    };
  };
  haptic?: {
    driver?: "drv2605l" | "solenoid";
    [k: string]: unknown;
  };
  host?: {
    default?: {
      nkro?: boolean;
    };
    [k: string]: unknown;
  };
  leader_key?: {
    timing?: boolean;
    strict_processing?: boolean;
    timeout?: UnsignedInt;
    [k: string]: unknown;
  };
  matrix_pins?: {
    custom?: boolean;
    custom_lite?: boolean;
    ghost?: boolean;
    input_pressed_state?: UnsignedInt;
    io_delay?: UnsignedInt;
    masked?: boolean;
    direct?: McuPinArray[];
    cols?: McuPinArray;
    rows?: McuPinArray;
  };
  modules?: string[];
  mouse_key?: {
    enabled?: boolean;
    delay?: UnsignedInt_8;
    interval?: UnsignedInt_8;
    max_speed?: UnsignedInt_8;
    time_to_max?: UnsignedInt_8;
    wheel_delay?: UnsignedInt_8;
    [k: string]: unknown;
  };
  oneshot?: {
    tap_toggle?: UnsignedInt;
    timeout?: UnsignedInt;
    [k: string]: unknown;
  };
  led_matrix?: {
    animations?: {
      [k: string]: boolean;
    };
    default?: {
      on?: boolean;
      animation?: string;
      val?: UnsignedInt_8;
      speed?: UnsignedInt_8;
      flags?: UnsignedInt_8;
    };
    driver?:
      | "custom"
      | "is31fl3218"
      | "is31fl3236"
      | "is31fl3729"
      | "is31fl3731"
      | "is31fl3733"
      | "is31fl3736"
      | "is31fl3737"
      | "is31fl3741"
      | "is31fl3742a"
      | "is31fl3743a"
      | "is31fl3745"
      | "is31fl3746a"
      | "snled27351";
    /**
     * @minItems 2
     * @maxItems 2
     */
    center_point?: [UnsignedInt_8, UnsignedInt_8];
    /**
     * @minItems 1
     */
    flag_steps?: [UnsignedInt_8, ...UnsignedInt_8[]];
    max_brightness?: UnsignedInt_8;
    timeout?: UnsignedInt;
    val_steps?: UnsignedInt;
    speed_steps?: UnsignedInt;
    led_flush_limit?: UnsignedInt;
    led_process_limit?: UnsignedInt;
    react_on_keyup?: boolean;
    sleep?: boolean;
    /**
     * @minItems 2
     * @maxItems 2
     */
    split_count?: [UnsignedInt, UnsignedInt];
    layout?: {
      /**
       * @minItems 2
       * @maxItems 2
       */
      matrix?: [number, number];
      x: UnsignedInt;
      y: UnsignedInt;
      flags?: UnsignedInt_8;
    }[];
    [k: string]: unknown;
  };
  rgb_matrix?: {
    animations?: {
      [k: string]: boolean;
    };
    default?: {
      on?: boolean;
      animation?: string;
      hue?: UnsignedInt_8;
      sat?: UnsignedInt_8;
      val?: UnsignedInt_8;
      speed?: UnsignedInt_8;
      flags?: UnsignedInt_8;
    };
    driver?:
      | "aw20216s"
      | "custom"
      | "is31fl3218"
      | "is31fl3236"
      | "is31fl3729"
      | "is31fl3731"
      | "is31fl3733"
      | "is31fl3736"
      | "is31fl3737"
      | "is31fl3741"
      | "is31fl3742a"
      | "is31fl3743a"
      | "is31fl3745"
      | "is31fl3746a"
      | "snled27351"
      | "ws2812";
    /**
     * @minItems 2
     * @maxItems 2
     */
    center_point?: [UnsignedInt_8, UnsignedInt_8];
    /**
     * @minItems 1
     */
    flag_steps?: [UnsignedInt_8, ...UnsignedInt_8[]];
    max_brightness?: UnsignedInt_8;
    timeout?: UnsignedInt;
    hue_steps?: UnsignedInt;
    sat_steps?: UnsignedInt;
    val_steps?: UnsignedInt;
    speed_steps?: UnsignedInt;
    led_flush_limit?: UnsignedInt;
    led_process_limit?: UnsignedInt;
    react_on_keyup?: boolean;
    sleep?: boolean;
    /**
     * @minItems 2
     * @maxItems 2
     */
    split_count?: [UnsignedInt, UnsignedInt];
    layout?: {
      /**
       * @minItems 2
       * @maxItems 2
       */
      matrix?: [number, number];
      x: UnsignedInt;
      y: UnsignedInt;
      flags?: UnsignedInt_8;
    }[];
    [k: string]: unknown;
  };
  rgblight?: {
    animations?: {
      [k: string]: boolean;
    };
    brightness_steps?: UnsignedInt;
    default?: {
      on?: boolean;
      animation?: string;
      hue?: UnsignedInt_8;
      sat?: UnsignedInt_8;
      val?: UnsignedInt_8;
      speed?: UnsignedInt_8;
    };
    driver?: "apa102" | "custom" | "ws2812";
    hue_steps?: UnsignedInt;
    layers?: {
      blink?: boolean;
      enabled?: boolean;
      max?: number;
      override_rgb?: boolean;
    };
    led_count?: UnsignedInt;
    /**
     * @minItems 2
     */
    led_map?: [UnsignedInt, UnsignedInt, ...UnsignedInt[]];
    max_brightness?: UnsignedInt_8;
    pin?: "NO_PIN" | string | number | null;
    rgbw?: boolean;
    saturation_steps?: UnsignedInt;
    sleep?: boolean;
    split?: boolean;
    /**
     * @minItems 2
     * @maxItems 2
     */
    split_count?: [UnsignedInt, UnsignedInt];
  };
  secure?: {
    enabled?: boolean;
    unlock_timeout?: UnsignedInt;
    idle_timeout?: UnsignedInt;
    /**
     * @minItems 1
     * @maxItems 5
     */
    unlock_sequence?:
      | [[number, number]]
      | [[number, number], [number, number]]
      | [[number, number], [number, number], [number, number]]
      | [[number, number], [number, number], [number, number], [number, number]]
      | [[number, number], [number, number], [number, number], [number, number], [number, number]];
  };
  stenography?: {
    enabled?: boolean;
    protocol?: "all" | "geminipr" | "txbolt";
  };
  ps2?: {
    enabled?: boolean;
    mouse_enabled?: boolean;
    clock_pin?: McuPin;
    data_pin?: McuPin;
    driver?: "busywait" | "interrupt" | "usart" | "vendor";
  };
  split?: {
    enabled?: boolean;
    bootmagic?: {
      /**
       * @minItems 2
       * @maxItems 2
       */
      matrix?: [number, number];
    };
    matrix_pins?: {
      right?: {
        direct?: McuPinArray[];
        cols?: McuPinArray;
        rows?: McuPinArray;
        unused?: McuPinArray;
      };
    };
    dip_switch?: {
      right?: DipSwitchConfig;
    };
    encoder?: {
      right?: EncoderConfig;
    };
    handedness?: {
      pin?: McuPin;
      matrix_grid?: McuPinArray & {
        [k: string]: unknown;
      };
    };
    soft_serial_pin?: "NO_PIN" | string | number | null;
    soft_serial_speed?: number;
    serial?: {
      driver?: "bitbang" | "usart" | "vendor";
      pin?: McuPin;
      speed?: number;
    };
    transport?: {
      protocol?: "custom" | "i2c" | "serial";
      sync?: {
        activity?: boolean;
        detected_os?: boolean;
        haptic?: boolean;
        layer_state?: boolean;
        indicators?: boolean;
        matrix_state?: boolean;
        modifiers?: boolean;
        oled?: boolean;
        st7565?: boolean;
        wpm?: boolean;
      };
      watchdog?: boolean;
      watchdog_timeout?: UnsignedInt;
      sync_matrix_state?: boolean;
      sync_modifiers?: boolean;
    };
    usb_detect?: {
      enabled?: boolean;
      polling_interval?: UnsignedInt;
      timeout?: UnsignedInt;
    };
    main?: "eeprom" | "left" | "matrix_grid" | "pin" | "right";
    matrix_grid?: McuPin[];
  };
  tags?: string[];
  tapping?: {
    chordal_hold?: boolean;
    force_hold?: boolean;
    force_hold_per_key?: boolean;
    ignore_mod_tap_interrupt?: boolean;
    hold_on_other_key_press?: boolean;
    hold_on_other_key_press_per_key?: boolean;
    permissive_hold?: boolean;
    permissive_hold_per_key?: boolean;
    retro?: boolean;
    retro_per_key?: boolean;
    term?: UnsignedInt;
    term_per_key?: boolean;
    toggle?: UnsignedInt;
    [k: string]: unknown;
  };
  usb?: {
    device_ver?: string;
    device_version?: BcdVersion;
    force_nkro?: boolean;
    pid?: HexNumber_4D;
    vid?: HexNumber_4D;
    max_power?: UnsignedInt;
    no_startup_check?: boolean;
    polling_interval?: UnsignedInt_8;
    shared_endpoint?: {
      keyboard?: boolean;
      mouse?: boolean;
    };
    suspend_wakeup_delay?: UnsignedInt;
    wait_for_enumeration?: boolean;
  };
  qmk?: {
    keys_per_scan?: UnsignedInt_8;
    tap_keycode_delay?: UnsignedInt;
    tap_capslock_delay?: UnsignedInt;
    locking?: {
      enabled?: boolean;
      resync?: boolean;
    };
  };
  qmk_lufa_bootloader?: {
    esc_output?: McuPin;
    esc_input?: McuPin;
    led?: McuPin;
    speaker?: McuPin;
  };
  ws2812?: {
    driver?: "bitbang" | "custom" | "i2c" | "pwm" | "spi" | "vendor";
    pin?: McuPin;
    rgbw?: boolean;
    i2c_address?: HexNumber_2D;
    i2c_timeout?: UnsignedInt;
  };
  [k: string]: unknown;
}
export interface DipSwitchConfig {
  pins?: McuPinArray;
  [k: string]: unknown;
}
export interface EncoderConfig {
  driver?: "custom" | "quadrature";
  rotary?: {
    pin_a: McuPin;
    pin_b: McuPin;
    resolution?: UnsignedInt;
  }[];
  [k: string]: unknown;
}
export interface BooleanArray {
  [k: string]: boolean;
}
export interface KeycodeDecl {
  key: Keycode;
  label?: TextIdentifier;
  /**
   * @minItems 1
   */
  aliases?: [KeycodeShort, ...KeycodeShort[]];
  [k: string]: unknown;
}
