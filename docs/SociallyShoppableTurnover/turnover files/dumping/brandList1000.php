<?php
include_once 'models.php';
use Cake\Utility\Hash;
use Cake\Utility\Inflector;

$modelBrands   = new bbrandprosperents();
$brandsResults = $modelBrands->find(['is_featured' => true], ['sort' => ['pack' => 1],]);

$brandsResults = object2Array($brandsResults);
$brandsResults = Hash::combine($brandsResults, '{n}._id', '{n}', '{n}.pack');

$brandsResults = array2Object($brandsResults);
?>

<div class="s_result_inner" ng-class="{active : (vm.activeTab == 4 && showstatic) }" ng-if="vm.activeTab == 4 && showstatic">
    <div class="s_result_left">
        <div class="s_result_header">A-Z</div>
        <ul class="s_result_alphabet">
            <li><a ng-click="ScrollToTarget($event,'#sHash3')" ng-class="{active : activeIt === '#sHash3'}">#</a></li>
            <li ng-repeat="letter in vm.alphabet">
                <a ng-click="ScrollToTarget($event,'#sLtr'+letter+'3')" ng-class="{active : activeIt === '#sLtr'+letter +'3'}" ng-bind="letter"></a>
            </li>
            <li class="view_all"><a ng-click="emptyselecteditem('brand',true)">VIEW ALL</a></li>
        </ul>
    </div>
    <div class="s_result_divider"></div>
    <div class="s_result_right">
        <div class="s_result_right_header">
            <div class="s_select_cat">
                <input type="checkbox" checked="checked" id="checkAllDegnr" ng-model="vm.checkAllDegnr">
                <label for="checkAllDegnr" class="checked" ng-class="{checked : vm.checkAllDegnr}" ng-click="vm.emptyselecteditem('brand',vm['checkAllDegnr'])">ALL DESIGNERS</label>
            </div>
            <div class="s_result_action">
                <div class="btn clear_btn" ng-click="vm.emptyselecteditem('brand',false)">CLEAR</div>
                <div class="btn cancel_btn" ng-click="vm.cancelSearch($event)">CANCEL</div>
                <div class="btn submit_btn" ng-click="searching_product($event,true)">SUBMIT</div>
            </div>
        </div>
        <div class="s_content_list defaultScroll" mcustom-scroll="{ 'theme': theme, 'autoHide': autoHide }" id="brandzindex" ng-class="{'ss_loading' : !brdloadingdone}">
            <div class="s_list_heading">ALL</div>
            <?php foreach ($brandsResults as $pack => $brands) : ?>
                <div class="s_alphabet_item ng-scope">
                    <h3 id="sLtr<?php echo strtoupper($pack); ?>3" ng-bind="letter" class="ng-binding"><?php echo strtoupper($pack); ?></h3>
                    <ul>
                        <?php
                        foreach ($brands as $pack => $brand) :
                            $brandName = $brand->brand;
                            $brand->brand = urlencode($brand->brand);
                            ?>
                            <li>
                                <input type="checkbox" id="<?php echo Inflector::underscore(Inflector::slug($brand->brand)); ?>" ng-true-value="true" ng-false-value="false" ng-click='vm.GetAllSelected(brd,"<?php echo $brand->brand; ?>",brdg["<?php echo $brand->brand; ?>"],selected_brandlist,"brand")' ng-model='brdg["<?php echo $brand->brand; ?>"]'>
                                <label for="<?php echo Inflector::underscore(Inflector::slug($brand->brand)); ?>" ng-class='{checked : brdg["<?php echo $brand->brand; ?>"]||vm.checkAllDegnr }'><?php echo $brandName; ?></label>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endforeach; ?>
        </div>


    </div>
</div>
