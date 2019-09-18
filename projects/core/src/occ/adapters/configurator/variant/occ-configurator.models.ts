export namespace OccConfigurator {
  /**
   *
   * An interface representing the variant configuration consumed through OCC.
   */
  export interface Configuration {
    /**
     * @member {string} [configId]
     */
    configId?: string;
    /**
     * @member {boolean} [complete]
     */
    complete?: boolean;

    groups?: Group[];
  }

  export interface Group {
    cstics?: Characteristic[];
  }

  export interface Characteristic {
    name?: string;
    langdepname?: string;
    domainvalues?: Value[];
    required?: boolean;
  }

  export interface Value {
    key?: string;
    name?: string;
    langdepname?: string;
    readonly?: boolean;
    selected?: boolean;
  }

  export enum UiType {
    STRING = 'STRING',
    NUMERIC = 'NUMERIC',
    CHECK_BOX = 'CHECK_BOX',
    CHECK_BOX_LIST = 'CHECK_BOX_LIST',
    RADIO_BUTTON = 'RADIO_BUTTON',
    RADIO_BUTTON_ADDITIONAL_INPUT = 'RADIO_BUTTON_ADDITIONAL_INPUT',
    DROPDOWN = 'DROPDOWN',
    DROPDOWN_ADDITIONAL_INPUT = 'DROPDOWN_ADDITIONAL_INPUT',
    READ_ONLY = 'READ_ONLY',
    NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
    SINGLE_SELECTION_IMAGE = 'SINGLE_SELECTION_IMAGE',
    MULTI_SELECTION_IMAGE = 'MULTI_SELECTION_IMAGE',
    READ_ONLY_SINGLE_SELECTION_IMAGE = 'READ_ONLY_SINGLE_SELECTION_IMAGE',
    READ_ONLY_MULTI_SELECTION_IMAGE = 'READ_ONLY_MULTI_SELECTION_IMAGE',
  }
}