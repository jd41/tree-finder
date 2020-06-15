declare module 'regular-table' {
  /**
   * The `<regular-table>` custom element.
   *
   * This module has no exports, but importing it has a side effect: the
   * `RegularTableElement` class is registered as a custom element, after which
   * it can be used as a standard DOM element.
   *
   * The documentation in this module defines the instance structure of a
   * `<regular-table>` DOM object instantiated typically, through HTML or any
   * relevent DOM method e.g. `document.createElement("perspective-viewer")` or
   * `document.getElementsByTagName("perspective-viewer")`.
   *
   * @extends HTMLElement
   */
  export class RegularTableElement extends HTMLElement {
    connectedCallback(): void;
    get_tds(): HTMLTableCellElement[];
    get_ths(): HTMLTableCellElement[];
    clear(): void;
    reset_viewport(): void;
    reset_scroll(): void;
    addStyleListener(styleListener: () => void): number;

    /**
     * Returns the `MetaData` object associated with a `<td>` or `<th>`.  When
     * your `StyleListener` is invoked, use this method to look up additional
     * `MetaData` about any `HTMLTableCellElement` in the rendered `<table>`.
     *
     * @param {HTMLTableCellElement|MetaData} element - The child element
     * of this `<regular-table>` for which to look up metadata, or a
     * coordinates-like object to refer to metadata by logical position.
     * @returns {MetaData} The metadata associated with the element.
     * @example
     * const elems = document.querySelector("td:last-child td:last_child");
     * const metadata = table.getMeta(elems);
     * console.log(`Viewport corner is ${metadata.x}, ${metadata.y}`);
     * @example
     * const header = table.getMeta({row_header_x: 1, dy: 3}).row_header;
     */
    getMeta(element: HTMLTableCellElement | Partial<MetaData>): MetaData;

    /**
     * Get performance statistics about this `<regular-table>`.  Calling this
     * method resets the internal state, which makes it convenient to measure
     * performance at regular intervals (see example).
     *
     * @memberof RegularTableElement
     * @returns {Performance} Performance data aggregated since the last
     * call to `getDrawFPS()`.
     * @example
     * const table = document.getElementById("my_regular_table");
     * setInterval(() => {
     *     const {real_fps} = table.getDrawFPS();
     *     console.log(`Measured ${fps} fps`)
     * });
     */
    getDrawFPS(): Performance;

    // /**
    //  * Call this method to set the `scrollLeft` and `scrollTop` for this
    //  * `<regular-table>` by calculating the position of this `scrollLeft`
    //  * and `scrollTop` relative to the underlying widths of its columns
    //  * and heights of its rows.
    //  *
    //  * @memberof RegularTableElement
    //  * @param {number} x - The left most `x` index column to scroll into view.
    //  * @param {number} y - The top most `y` index row to scroll into view.
    //  * @param {number} ncols - Total number of columns in the data model.
    //  * @param {number} nrows - Total number of rows in the data model.
    //  * @example
    //  * table.scrollTo(1, 3, 10, 30);
    //  */
    // scrollTo(x: number, y: number, ncols: number, nrows: number): void;

    /**
     * Call this method to set `DataListener` for this `<regular-table>`,
     * which will be called whenever a new data slice is needed to render.
     * Calls to `draw()` will fail if no `DataListener` has been set
     *
     * @memberof RegularTableElement
     * @param {DataListener} dataListener
     * `dataListener` is called by to request a rectangular section of data
     * for a virtual viewport, (x0, y0, x1, y1), and returns a `DataReponse`
     * object.
     * @example
     * table.setDataListener((x0, y0, x1, y1) => {
     *     return {
     *         num_rows: num_rows = DATA[0].length,
     *         num_columns: DATA.length,
     *         data: DATA.slice(x0, x1).map(col => col.slice(y0, y1))
     *     };
     * })
     */
    setDataListener(dataListener: DataListener): void;
    _invalid_schema: boolean;
    _view_cache: {
        view: Function;
        config: {
            row_pivots: any[];
            column_pivots: any[];
        };
        schema: {};
    };
  }

  /**
  * An object with performance statistics about calls to
  * `draw()` from some time interval (captured in milliseconds by the
  * `elapsed` proprty).
  */
  export type Performance = {
    /**
     * - Avergage milliseconds per call.
     */
    avg: number;
    /**
     * - `num_frames` / `elapsed`
     */
    real_fps: number;
    /**
     * - `elapsed` / `avg`
     */
    virtual_fps: number;
    /**
     * - Number of frames rendered.
     */
    num_frames: number;
    /**
     * - Number of milliseconds since last call
     * to `getDrawFPS()`.
     */
    elapsed: number;
  };
  /**
  * An object describing virtual rendering metadata about an
  * `HTMLTableCellElement`, use this object to map rendered `<th>` or `<td>`
  * elements back to your `data`, `row_headers` or `column_headers` within
  * listener functions for `addStyleListener()` and `addEventListener()`.
  */
  export type MetaData = {
    /**
     * - The `x` index in your virtual data model.
     * property is only generated for `<td>`, `<th>` from `row_headers`.
     */
    x?: number;
    /**
     * - The `y` index in your virtual data model.
     * property is only generated for `<td>`, `<th>` from `row_headers`.
     */
    y?: number;
    /**
     * - The `x` index of the viewport origin in
     * your data model, e.g. what was passed to `x0` when your
     * `dataListener` was invoked.
     */
    x0?: number;
    /**
     * - The `y` index of the viewport origin in
     * your data model, e.g. what was passed to `x0` when your
     * `dataListener` was invoked.
     */
    y0?: number;
    /**
     * - The `x` index in `DataResponse.data`, this
     * property is only generated for `<td>`, and `<th>` from `column_headers`.
     */
    dx?: number;
    /**
     * - The `y` index in `DataResponse.data`, this
     * property is only generated for `<td>`, `<th>` from `row_headers`.
     */
    dy?: number;
    /**
     * - The `y` index in
     * `DataResponse.column_headers[x]`, this property is only generated for `<th>`
     * from `column_headers`.
     */
    column_header_y?: number;
    /**
     * - The `x` index in
     * `DataResponse.row_headers[y]`, this property is only generated for `<th>`
     * from `row_headers`.
     */
    column_header_x?: number;
    /**
     * - The unique index of this column in a full
     * `<table>`, which is `x` + (Total Row Header Columns).
     */
    size_key: number;
    /**
     * - The `Array` for this `y` in
     * `DataResponse.row_headers`, if it was provided.
     */
    row_header?: Array<object>;
    /**
     * - The `Array` for this `x` in
     * `DataResponse.column_headers`, if it was provided.
     */
    column_header?: Array<object>;
  };

  /**
  * The `DataResponse` object describes a rectangular region of a virtual
  * data set, and some associated metadata.  `<regular-table>` will use this
  * object to render the `<table>`, though it may make multiple requests for
  * different regions to achieve a compelte render as it must estimate
  * certain dimensions.  You must construct a `DataResponse` object to
  * implement a `DataListener`.
  */
  export type DataResponse = {
    /**
     * - A two dimensional
     * `Array` of column group headers, in specificity order.  No `<thead>`
     * will be generated if this property is not provided.
     */
    column_headers?: Array<Array<object>>;
    /**
     * - A two dimensional
     * `Array` of row group headers, in specificity order.  No `<th>`
     * elements within `<tbody>` will be generated if this property is not
     * provided.
     */
    row_headers?: Array<Array<object>>;
    /**
     * - A two dimensional `Array`
     * representing a rectangular section of the underlying data set from
     * (x0, y0) to (x1, y1), arranged in columnar fashion such that
     * `data[x][y]` returns the `y`th row of the `x`th column of the slice.
     */
    data: Array<Array<object>>;
    /**
     * - Total number of rows in the underlying
     * data set.
     */
    num_rows: number;
    /**
     * - Total number of columns in the
     * underlying data set.
     */
    num_columns: number;
  };

  /**
   * The `DataListener` is similar to a normal event listener function.
   * Unlike a normal event listener, it takes regular arguments (not an
   * `Event`); and returns a `Promise` for a `DataResponse` object for this
   * region (as opposed to returning `void` as a standard event listener).
   */
  export type DataListener = Function;
}
