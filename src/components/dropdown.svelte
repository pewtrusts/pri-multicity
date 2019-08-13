<script>
  export let label;
  export let options;

</script>

<style lang="scss">
    @import './../variables.scss';
    .dropdown-outer {
        max-width: 300px;
        min-width: 300px;
        font-size: 16px;
        font-weight: 700;
        color: $dark_blue;
        margin-right: 40px;
        margin-bottom: 5px;
        label {
            font-size: 16px;
            margin: 0;
            display: block;
        }
    }
    .dropdown-inner {
        position: relative;
        background-color: rgba(255,255,255,0);
        cursor: pointer;
        border-bottom: 4px solid #296ec3;
        background: url("data:image/svg+xml;charset=utf-8,%3Csvg class='local-navigation__link-chevron' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23296ec3' d='M7.406 7.828L12 12.422l4.594-4.594L18 9.234l-6 6-6-6z'/%3E%3C/svg%3E") 100%/22px no-repeat;
        height: 40px;
        color: #296ec3;
    }
    .dropdown {
        padding: 12px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        background-color: rgba(255,255,255,0);
        & > div {
            position: relative;
            background-color: rgba(255,255,255,0);
        }
        & > ul {
            position: absolute;
           // display:none;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: #fff;
            max-height: 350px;
            overflow-y: auto;
            z-index: 1;
            padding: 0;
            margin-left: 0;
            border: 1px solid #aeadad;
            li {
                list-style-type: none;
                margin: 0;
                padding: 12px;
                &:hover {
                    background-color: #eef6ff;
                    text-decoration: underline;
                    
                }

            }
        }
        &.isOpen {
            background-color: #296ec3;
            color: #fff;
        }
        &.isOpen > ul {
            display: block;
            color: #296ec3;
        }
    }
</style>

<div class="dropdown-outer">
    <label>{label}</label>
    <div class="dropdown-inner">
        <div class="dropdown" aria-haspopup="listbox" aria-expanded="false" role="button" tabindex="0">
            <div>currentValue</div>
            <ul aria-role="listbox" aria-activedescendant=activeItemID>
            {#each options as option}
                <li data-value="{option.value}" aria-selected="TODO" aria-role="option" id="dropdown-item-{option.value}">{option.display}</li>
            {/each}
            </ul>
        </div>
    </div>
</div>