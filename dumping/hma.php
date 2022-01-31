<?php
include_once 'models.php';
if (isset($_POST)) {
    echo '<pre>';
    var_export($_POST);
    echo '</pre>';
}
?>

<form action="" method="post" id="proxy-search-form">

    <div class="row">
        <div class="large-3 medium-6 columns">
            <fieldset>
                <legend>Proxy country</legend>

                <div class="row all-countries">
                    <label for="proxyAllCountries" class="switch-label">
                        <input type="checkbox" name="ac" checked="checked" id="proxyAllCountries">
                        <span></span>
                        All countries
                    </label>
                </div>

                <div class="row selected-countries">
                    <select name="c[]" id="proxySelectedCountries" class="small-12 columns" size="6" multiple="">
                        <option rel="104" value="China" selected="selected">China (104)</option>
                        <option rel="8" value="United States" selected="selected">United States (8)</option>
                        <option rel="7" value="Venezuela" selected="selected">Venezuela (7)</option>
                        <option rel="7" value="Indonesia" selected="selected">Indonesia (7)</option>
                        <option rel="5" value="Russian Federation" selected="selected">Russian Federation (5)</option>
                        <option rel="3" value="Australia" selected="selected">Australia (3)</option>
                        <option rel="3" value="Slovakia" selected="selected">Slovakia (3)</option>
                        <option rel="3" value="Brazil" selected="selected">Brazil (3)</option>
                        <option rel="3" value="Taiwan" selected="selected">Taiwan (3)</option>
                        <option rel="3" value="Taiwan" selected="selected">Taiwan (3)</option>
                        <option rel="2" value="Thailand" selected="selected">Thailand (2)</option>
                        <option rel="2" value="Bulgaria" selected="selected">Bulgaria (2)</option>
                        <option rel="2" value="Egypt" selected="selected">Egypt (2)</option>
                        <option rel="1" value="Latvia" selected="selected">Latvia (1)</option>
                        <option rel="1" value="Afghanistan" selected="selected">Afghanistan (1)</option>
                        <option rel="1" value="Hong Kong" selected="selected">Hong Kong (1)</option>
                        <option rel="1" value="Philippines" selected="selected">Philippines (1)</option>
                        <option rel="1" value="Dominican Republic" selected="selected">Dominican Republic (1)</option>
                        <option rel="1" value="Viet Nam" selected="selected">Viet Nam (1)</option>
                        <option rel="1" value="United Kingdom" selected="selected">United Kingdom (1)</option>
                        <option rel="1" value="Peru" selected="selected">Peru (1)</option>
                        <option rel="1" value="Argentina" selected="selected">Argentina (1)</option>
                        <option rel="1" value="Colombia" selected="selected">Colombia (1)</option>
                        <option rel="1" value="India" selected="selected">India (1)</option>
                        <option rel="1" value="Poland" selected="selected">Poland (1)</option>
                        <option rel="1" value="Chile" selected="selected">Chile (1)</option>
                        <option rel="1" value="United Arab Emirates" selected="selected">United Arab Emirates (1)</option>
                        <option rel="1" value="Korea, Republic of" selected="selected">Korea, Republic of (1)</option>
                        <option rel="1" value="Canada" selected="selected">Canada (1)</option>
                        <option rel="1" value="Europe" selected="selected">Europe (1)</option>
                    </select>

                    <ul class="small-12 columns country-ordering">
                        <li class="active"><a href="javascript:void(0)" id="country-sort-count">Sort by count</a></li>
                        <li><a href="javascript:void(0)" id="country-sort-name">Sort by name</a></li>
                    </ul>
                </div>
            </fieldset>
        </div>
        <div class="large-3 medium-6 columns">
            <fieldset>
                <legend>Ports</legend>

                <div class="row all-ports">
                    <label for="proxyAllPorts" class="switch-label">
                        <input type="checkbox" name="allPorts" checked="checked" id="proxyAllPorts" value="1">
                        <span></span>
                        All ports
                    </label>
                </div>

                <div class="row selected-ports">
                    <input name="p" id="ports" value="">
                </div>
                <div class="row selected-ports-tip">
                    TIP: Enter specific ports in the above box. Separate more than one port by a comma (8080, 80,443 ...). A maximum of 20 ports allowed.
                </div>

            </fieldset>
        </div>
        <div class="clear-both show-for-medium-only"></div>
        <div class="large-2 medium-4 columns">
            <fieldset>
                <legend>Protocol</legend>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="pr[]" value="0" checked="checked"><span></span>HTTP</label>
                </div>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="pr[]" value="1" checked="checked"><span></span>HTTPS</label>
                </div>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="pr[]" value="2" checked="checked"><span></span>socks4/5</label>
                </div>
            </fieldset>
        </div>
        <div class="large-2 medium-4 columns">
            <fieldset>
                <legend>Anonymity level</legend>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="a[]" value="0" checked="checked"><span></span>None</label>
                </div>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="a[]" value="1" checked="checked"><span></span>Low</label>
                </div>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="a[]" value="2" checked="checked"><span></span>Medium</label>
                </div>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="a[]" value="3" checked="checked"><span></span>High</label>
                </div>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="a[]" value="4" checked="checked"><span></span>High +KA</label>
                </div>
            </fieldset>

            <fieldset>
                <legend>PlanetLab</legend>

                <div class="row">
                    <label for="proxyPlanetLab" class="switch-label">
                        <input type="checkbox" id="proxyPlanetLab" name="pl" checked="checked">
                        <span></span>
                        Include
                    </label>
                </div>
            </fieldset>
        </div>
        <div class="large-2 medium-4 columns">
            <fieldset>
                <legend>Speed</legend>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="sp[]" value="1" checked="checked"><span></span>Slow</label>
                </div>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="sp[]" value="2" checked="checked"><span></span>Medium</label>
                </div>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="sp[]" value="3" checked="checked"><span></span>Fast</label>
                </div>
            </fieldset>

            <fieldset>
                <legend>Connection Time</legend>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="ct[]" value="1" checked="checked"><span></span>Slow</label>
                </div>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="ct[]" value="2" checked="checked"><span></span>Medium</label>
                </div>
                <div class="row">
                    <label class="switch-label"><input type="checkbox" name="ct[]" value="3" checked="checked"><span></span>Fast</label>
                </div>
            </fieldset>
        </div>
    </div>

    <div class="row ordering">
        <div class="large-3 medium-3 columns">

            <select name="s">
                <option value="0" selected="selected">Date tested</option>
                <option value="1">Response time</option>
                <option value="2">Connection time</option>
                <option value="3">Country A-Z</option>
            </select>

        </div>

        <div class="large-2 medium-2 columns">
            <select name="o">
                <option value="0" selected="selected">DESC</option>
                <option value="1">ASC</option>
            </select>
        </div>

        <div class="large-3 medium-3 columns">
            <select name="pp">
                <option value="0">10 per page</option>
                <option value="1">25 per page</option>
                <option value="2" selected="selected">50 per page</option>
                <option value="3">100 per page</option>
            </select>
        </div>

        <div class="large-3 medium-3 medium-centered columns submit">
            <button type="submit" id="proxy-list-upd-btn" class="button jungle-pool small expand">Update results</button>
        </div>
    </div>
    <input type="hidden" name="sortBy" value="date">
</form>